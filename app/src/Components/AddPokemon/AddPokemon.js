import React, { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from './AddPokemon.module.css';

const AddPokemon = () => {
    const [pokemons, setPokemons] = useState([]);
    const [pokemonOwnerName, setPokemonOwnerName] = useState("");
    const [pokemonName, setPokemonName] = useState("");
    const [pokemonAbility, setPokemonAbility] = useState("");
    const [pokemonCount, setPokemonCount] = useState(1);
    const [initialPositionX, setInitialPositionX] = useState("");
    const [initialPositionY, setInitialPositionY] = useState("");
    const [speed, setSpeed] = useState("");
    const [direction, setDirection] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        fetchPokemons();
    },[]);

    const fetchPokemons = async () => {
        const data = await fetch("https://pokeapi.co/api/v2/pokemon-species/");
        const json = await data.json();
        setPokemons(json?.results);
    }

    const findPokemon = async (url) => {
        const PokemonData = await fetch(url);
        const json = await PokemonData.json();
        setPokemonName(json?.name);
        setPokemonAbility(json?.capture_rate);
    }

    const handleAddPokemon = async (e) => {
        e.preventDefault();
        const newUser = {pokemonOwnerName, pokemonName, pokemonAbility,pokemonCount, initialPositionX, initialPositionY, speed, direction};

        try{
            const response = await axios.post('http://localhost:4000/pokemon/add', newUser);
            setPokemonOwnerName("");
            setPokemonName("");
            setPokemonAbility("");
            setPokemonCount("");
            setInitialPositionX("");
            setInitialPositionY("");
            setSpeed("");
            setDirection("");
            navigate('/users');

        }catch(error){
            console.log(error);
        }

    }

    return(
        <div className={styles.addDiv}>
            <h1>Create Pokemon User</h1>
            <form className={styles.formContainer}>
                <input type="text"
                placeholder="Pokemon Owner" 
                value={pokemonOwnerName}
                onChange={(e) => setPokemonOwnerName(e.target.value)}
                required
                className={styles.formInput}
                />
                <br/>
                <select onChange={(e) => {
                    findPokemon(e.target.value);
                }}
                className={styles.formInput}
                >
                    <option value="">Select Pokemon</option>
                    {pokemons.map((pokemon, index) => (
                        <option key={index} value={pokemon.url}>{pokemon.name}</option>
                    ))}
                </select>
                <input type="number"
                placeholder="Pokemon Ability"
                value={pokemonAbility}
                readOnly
                className={styles.formInput}
                />
                <input type="number"
                placeholder="Pokemon Count"
                value={pokemonCount}
                readOnly
                className={styles.formInput}
                />
                <input type="number"
                placeholder="Initialposition X"
                value={initialPositionX}
                onChange={(e) => setInitialPositionX(e.target.value)}
                className={styles.formInput}
                />
                <input type="number"
                placeholder="Initialposition Y"
                value={initialPositionY}
                onChange={(e) => setInitialPositionY(e.target.value)}
                className={styles.formInput}
                />
                <input type="number"
                placeholder="Speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className={styles.formInput}
                />
                <input type="text"
                placeholder="Direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className={styles.formInput}
                />
                <br />
                <button className={styles.formButton}
                onClick={handleAddPokemon}>Add</button>
            </form>
        </div>
    );
}

export default AddPokemon;