import React, { useState, useEffect} from "react";
import axios from "axios";


const AddPokemon = () => {
    const [pokemons, setPokemons] = useState([]);
    const [pokemonOwnerName, setPokemonOwnerName] = useState("");
    const [pokemonName, setPokemonName] = useState("");
    const [pokemonAbility, setPokemonAbility] = useState("");
    const [initialPositionX, setInitialPositionX] = useState("");
    const [initialPositionY, setInitialPositionY] = useState("");
    const [speed, setSpeed] = useState("");
    const [direction, setDirection] = useState("");

    useEffect(()=>{
        fetchPokemons();
    },[]);

    const fetchPokemons = async () => {
        const data = await fetch("https://pokeapi.co/api/v2/pokemon-species/");
        const json = await data.json();
        console.log(json);
        setPokemons(json?.results);
    }

    const findPokemon = async (url) => {
        const PokemonData = await fetch(url);
        const json = await PokemonData.json();
        console.log(json);
        setPokemonName(json?.name);
        setPokemonAbility(json?.capture_rate);
    }

    const handleAddPokemon = async (e) => {
        e.preventDefault();
        console.log(pokemonAbility, "ability");
        const newUser = {pokemonOwnerName, pokemonName, pokemonAbility, initialPositionX, initialPositionY, speed, direction};
        console.log(newUser);

        try{
            const response = await axios.post('http://localhost:4000/pokemon/add', newUser);
            console.log(response);

        }catch(error){
            console.log(error);
        }

    }

    return(
        <div>
            <form>
                <h1>Create Pokemon User</h1>
                <input type="text"
                placeholder="Pokemon Owner" 
                value={pokemonOwnerName}
                onChange={(e) => setPokemonOwnerName(e.target.value)}
                required
                />
                <select onChange={(e) => {
                    console.log(e.target.value);
                    findPokemon(e.target.value);
                }}>
                    <option value="">Select</option>
                    {pokemons.map((pokemon, index) => (
                        <option key={index} value={pokemon.url}>{pokemon.name}</option>
                    ))}
                </select>
                <input type="number"
                placeholder="Pokemon Ability"
                value={pokemonAbility}
                readOnly
                />
                <input type="number"
                placeholder="Initialposition X"
                value={initialPositionX}
                onChange={(e) => setInitialPositionX(e.target.value)}
                />
                <input type="number"
                placeholder="Initialposition Y"
                value={initialPositionY}
                onChange={(e) => setInitialPositionY(e.target.value)}
                />
                <input type="number"
                placeholder="Speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                />
                <input type="text"
                placeholder="Direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                />
                <button onClick={handleAddPokemon}>Add</button>
            </form>
        </div>
    );
}

export default AddPokemon;