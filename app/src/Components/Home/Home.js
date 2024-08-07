import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Home.module.css";

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

    // Check if the pokemon is about to cross the container bounds
    const willCrossBounds =
      left < 0 ||
      left > container.clientWidth - pokemonWidth ||
      top < 0 ||
      top > container.clientHeight - pokemonHeight;

    if (willCrossBounds) {
      return {
        left: pokemon.initialPositionX,
        top: pokemon.initialPositionY,
        isVisible: false,
        reset: true,
      };
    }

    return { left, top, isVisible: true, reset: false };
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

        if (newPosition.reset) {
          clearInterval(intervals.current[pokemon._id]);
          setTimeout(() => {
            setPokemonPositions((prevState) => ({
              ...prevState,
              [pokemon._id]: {
                left: pokemon.initialPositionX,
                top: pokemon.initialPositionY,
                isVisible: true,
              },
            }));
          }, 1000); // Delay of 1 second before showing the Pokemon at the initial position
          return {
            ...prevState,
            [pokemon._id]: { ...newPosition, isVisible: false },
          };
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
        setPokemonPositions((prevState) => ({
          ...prevState,
          [pokemon._id]: {
            ...prevState[pokemon._id],
            isVisible: false,
          },
        }));
      } else {
        handlePokemonGo(pokemon);
        setPokemonPositions((prevState) => ({
          ...prevState,
          [pokemon._id]: {
            ...prevState[pokemon._id],
            isVisible: true,
          },
        }));
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
      <div>
        <Link to="/addnew">
          <button className={styles.new}>Add New Pokemon</button>
        </Link>
        <Link to="/users">
          <button className={styles.new}>View Pokemons</button>
        </Link>
      </div>
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
                <td>{pokemon.pokemonCount}</td>
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
        {currentPlayer && currentPlayer._id && (
          <div
            key={currentPlayer._id}
            style={{
              position: "relative", // Ensure the wrapper div is relative for tooltip positioning
            }}
          >
            <div
              style={{
                position: "absolute",
                left:
                  pokemonPositions[currentPlayer._id]?.left ||
                  currentPlayer.initialPositionX,
                top:
                  pokemonPositions[currentPlayer._id]?.top ||
                  currentPlayer.initialPositionY,
                transition: freeze[currentPlayer._id]
                  ? "none"
                  : `all 0.1s linear`,
                display:
                  pokemonPositions[currentPlayer._id]?.isVisible === false
                    ? "none"
                    : "block",
                width: "auto",
                height: "30px",
                border: "5px solid #ee9626",
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "#ffe135",
              }}
            >
              {currentPlayer.pokemonName}
            </div>
            {flee[currentPlayer._id] && (
              <div
                className={styles.tooltip}
                style={{
                  position: "absolute",
                  top: "5px", // Position tooltip above Pokemon
                  left: "50%", // Center tooltip horizontally
                  transform: "translateX(-50%)",
                  zIndex: 2
                }}
              >
                Danger! This Pokemon is fleeing.
                <div className={styles.tooltipArrow}></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
