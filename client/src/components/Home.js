import React, { useState, useEffect } from "react";
import axios from "axios";
import './Users.css';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [pokemons, setPokemons] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState({});
    const [pokemonPositions, setPokemonPositions] = useState({});
    const [flee, setFlee] = useState({});
    const [freeze, setFreeze] = useState({});

    useEffect(() => {
        fetchUsers();
    },[]);

    const fetchUsers = () => {
        axios.get('http://localhost:4000/user/all').then((response) => {
            console.log(response.data?.users);
            setUsers(response.data?.users);
        });
    }

    const fetchPokemons = (id) => {
        axios.get('http://localhost:4000/pokemon/all').then((response) => {
            const data = response.data?.pokemons.filter((pokemon) => pokemon.owner._id === id);
            console.log(data);
            setPokemons(data);
        })
    }

    const handlePokemonGo = (pokemon) => {
        if (freeze[pokemon._id]) return;

        const movePokemon = (currentPosition) => {
            const container = document.getElementById('pokemon-container');
            let { left, top } = currentPosition;

            const moveStep = pokemon.speed * 10; // Assuming speed is in pixels per second

            switch (pokemon.direction) {
                case 'up':
                    top -= moveStep;
                    break;
                case 'down':
                    top += moveStep;
                    break;
                case 'left':
                    left -= moveStep;
                    break;
                case 'right':
                    left += moveStep;
                    break;
                default:
                    break;
            }

            // Ensure the Pokémon stays within the container bounds
            left = Math.max(0, Math.min(left, container.clientWidth - 50));
            top = Math.max(0, Math.min(top, container.clientHeight - 50));

            // If Pokémon moves out of bounds, hide it
            const isVisible = left >= 0 && left <= container.clientWidth && top >= 0 && top <= container.clientHeight;

            return { left, top, isVisible };
        };

        const interval = setInterval(() => {
            setPokemonPositions((prevState) => {
                const currentPosition = prevState[pokemon._id] || { left: pokemon.initialPositionX, top: pokemon.initialPositionY };
                const newPosition = movePokemon(currentPosition);

                if (!newPosition.isVisible) {
                    clearInterval(interval);
                    return prevState;
                }

                return { ...prevState, [pokemon._id]: newPosition };
            });
        }, 100);
    };

    const handlePokemonFlee = (pokemon) => {
        setFlee((prevState) => ({
            ...prevState,
            [pokemon._id]: !prevState[pokemon._id]
        }));
    };

    const handlePokemonCease = (pokemon) => {
        setFreeze((prevState) => ({
            ...prevState,
            [pokemon._id]: !prevState[pokemon._id]
        }));
    };
 
    return(
        <div>
            <select onChange={(e) => fetchPokemons(e.target.value)} defaultValue="">
                <option value="" disabled>Select a user</option>
                {users.map((user) => (
                    <option key={user._id} value={user._id}>{user.pokemonOwnerName}</option>
                ))}
            </select>
            <table>
                <thead>
                    <tr>
                        <th>Name of Pokemon</th>
                        <th>Ability of Pokemon</th>
                        <th>Number of Pokemon</th>
                        <th>Position X</th>
                        <th>Position Y</th>
                        <th>Speed</th>
                        <th>Direction</th>
                    </tr>
                </thead>
                <tbody>
                    {pokemons.map((pokemon) => (
                        <tr key={pokemon._id} onClick={() => setCurrentPlayer(pokemon)}>
                            <td>{pokemon.pokemonName}</td>
                            <td>{pokemon.pokemonAbility}</td>
                            <td>1</td>
                            <td>{pokemon.initialPositionX}</td>
                            <td>{pokemon.initialPositionY}</td>
                            <td>{pokemon.speed}</td>
                            <td>{pokemon.direction}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>{currentPlayer.pokemonName}</p>
            <div>
                <button onClick={() => handlePokemonGo(currentPlayer)}>Pokemon Go</button>
                <button onClick={() => handlePokemonFlee(currentPlayer)}>Pokemon Flee</button>
                <button onClick={() => handlePokemonCease(currentPlayer)}>Pokemon Cease</button>
            </div>
            
            <div id="pokemon-container" style={{ position: 'relative', width: '600px', height: '400px', border: '1px solid black' }}>
                {pokemons.map((pokemon) => {
                    const position = pokemonPositions[pokemon._id] || { left: pokemon.initialPositionX, top: pokemon.initialPositionY };
                    const isVisible = flee[pokemon._id] ? false : true;
                    return (
                        <div
                            key={pokemon._id}
                            style={{
                                position: 'absolute',
                                left: position.left,
                                top: position.top,
                                transition: freeze[pokemon._id] ? 'none' : `all ${pokemon.speed}s linear`,
                                display: isVisible ? 'block' : 'none',
                                border : '2px solid yellow',
                                padding : '10px',
                                borderRadius : '50%',
                                backgroundColor : 'yellow'
                            }}
                        >
                            {pokemon.pokemonName}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;