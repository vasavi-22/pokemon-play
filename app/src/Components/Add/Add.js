import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './Add.module.css';

const Add = () => {
  const location = useLocation();
  const pokemon = location.state?.pokemon;
  console.log(pokemon);

  const [pokemonCount, setPokemonCount] = useState(pokemon ? pokemon.pokemonCount : 1);
  const [id, setId] = useState(pokemon ? pokemon._id : "");

  useEffect(() => {
    if(pokemon){
        setPokemonCount(pokemon.pokemonCount);
        setId(pokemon._id);
    }
  },[pokemon]);

  const navigate = useNavigate();

  const addPokemon = async (e) => {
    e.preventDefault();
    const updateData = { pokemonCount };
    try{
        const response = await axios.put(
            `/pokemon/edit/${id}`,
            updateData
          );
        console.log(response);
        navigate('/users');
    }catch(error){
        console.log(error);
    }
  }

  if (!pokemon) {
    return <div className={styles.addPokemonDiv}>Loading...</div>;
  }

  return (
    <div className={styles.addPokemonDiv}>
      <h1>Add Pokemon</h1>
      <form>
        <input
          type="text"
          placeholder="Pokemon Name"
          value={pokemon.owner.pokemonOwnerName}
          readOnly
        />
        <br />
        <input
          type="text"
          placeholder="Pokemon Owner Name"
          value={pokemon.pokemonName}
          readOnly
        />
        <br />
        <input
          type="text"
          placeholder="Pokemon Ability"
          value={pokemon.pokemonAbility}
          readOnly
        />
        <br />
        <input type="numer"
        placeholder="Number of Pokemon"
        value={pokemonCount}
        onChange={(e) => setPokemonCount(e.target.value)}
        />
        <br />
        <button onClick={addPokemon}>Save</button>
      </form>
    </div>
  );
};

export default Add;
