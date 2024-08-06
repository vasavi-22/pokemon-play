import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from './Home.module.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [pokemonPositions, setPokemonPositions] = useState({});
  const [flee, setFlee] = useState({});
  const [freeze, setFreeze] = useState({});
  const intervals = useRef({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("/user/all").then((response) => {
      setUsers(response.data?.users);
    });
  };

  const fetchPokemons = (id) => {
    axios.get("/pokemon/all").then((response) => {
      const data = response.data?.pokemons.filter(
        (pokemon) => pokemon.owner._id === id
      );
      setPokemons(data);
    });
  };

  const movePokemon = (pokemon, currentPosition) => {
    const container = document.getElementById(styles.pokemonContainer);
    const pokemonWidth = 50; 
    const pokemonHeight = 50;

    let { left, top } = currentPosition;

    const moveStep = (pokemon.speed * 20) / 100; // speed in pixels per 100ms

    switch (pokemon.direction) {
      case "up":
        top -= moveStep;
        break;
      case "down":
        top += moveStep;
        break;
      case "left":
        left -= moveStep;
        break;
      case "right":
        left += moveStep;
        break;
      default:
        break;
    }

   // ensure the pokemon stays within the container bounds
    left = Math.max(0, Math.min(left, container.clientWidth - pokemonWidth));
    top = Math.max(0, Math.min(top, container.clientHeight - pokemonHeight));

    // if pokemon moves out of bounds, hide it
    const isVisible =
      left >= 0 &&
      left <= container.clientWidth - pokemonWidth &&
      top >= 0 &&
      top <= container.clientHeight - pokemonHeight;

    return { left, top, isVisible };
  };

  const handlePokemonGo = (pokemon) => {
    if (flee[pokemon._id]) return; // prevent movement if in flee state

    clearInterval(intervals.current[pokemon._id]);

    intervals.current[pokemon._id] = setInterval(() => {
      setPokemonPositions((prevState) => {
        const currentPosition = prevState[pokemon._id] || {
          left: pokemon.initialPositionX,
          top: pokemon.initialPositionY,
        };
        const newPosition = movePokemon(pokemon, currentPosition);

        if (!newPosition.isVisible) {
          clearInterval(intervals.current[pokemon._id]);
          return prevState;
        }

        return { ...prevState, [pokemon._id]: newPosition };
      });
    }, 100);
  };

  const handlePokemonFlee = (pokemon) => {
    setFlee((prevState) => {
      const newFleeState = !prevState[pokemon._id];

      if (newFleeState) {
        clearInterval(intervals.current[pokemon._id]);
      } else {
        handlePokemonGo(pokemon);
      }

      return { ...prevState, [pokemon._id]: newFleeState };
    });
  };

  const handlePokemonCease = (pokemon) => {
    setFreeze((prevState) => {
      const newFreezeState = !prevState[pokemon._id];

      if (newFreezeState) {
        clearInterval(intervals.current[pokemon._id]);
      } else {
        handlePokemonGo(pokemon);
      }

      return { ...prevState, [pokemon._id]: newFreezeState };
    });
  };

  return (
    <div className={styles.homeDiv}>
      <Link to="/add">
        <button className={styles.new}>Add New Pokemon</button>
      </Link>
      <select
        onChange={(e) => {
          fetchPokemons(e.target.value);
          setCurrentPlayer({});
        }}
        defaultValue=""
        className={styles.user}
      >
        <option value="" disabled>
          Select a user
        </option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.pokemonOwnerName}
          </option>
        ))}
      </select>
      <table className={styles.tableContainer}>
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
          {pokemons.length > 0 ? (
            pokemons.map((pokemon) => (
              <tr key={pokemon._id} onClick={() => setCurrentPlayer(pokemon)}>
                <td>{pokemon.pokemonName}</td>
                <td>{pokemon.pokemonAbility}</td>
                <td>1</td>
                <td>{pokemon.initialPositionX}</td>
                <td>{pokemon.initialPositionY}</td>
                <td>{pokemon.speed}</td>
                <td>{pokemon.direction}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No Pokemons Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className={styles.name}>{currentPlayer.pokemonName}</p>
      <div className={styles.btns}>
        <button onClick={() => handlePokemonGo(currentPlayer)}>
          Pokemon Go
        </button>
        <button onClick={() => handlePokemonFlee(currentPlayer)}>
          Pokemon Flee
        </button>
        <button onClick={() => handlePokemonCease(currentPlayer)}>
          Pokemon Cease
        </button>
      </div>

      <div id={styles.pokemonContainer}>
        {pokemons.map((pokemon) => {
          const position = pokemonPositions[pokemon._id] || {
            left: pokemon.initialPositionX,
            top: pokemon.initialPositionY,
          };
          const isVisible = flee[pokemon._id] ? false : true;
          return (
            <div
              key={pokemon._id}
              style={{
                position: "absolute",
                left: position.left,
                top: position.top,
                transition: freeze[pokemon._id] ? "none" : `all 0.1s linear`,
                display: isVisible ? "block" : "none",
                width: "auto",
                height: "30px",
                border: "2px solid yellow",
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "yellow",
              }}
            >
              {pokemon.pokemonName}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;