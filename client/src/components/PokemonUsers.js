import React, { useState, useEffect } from "react";
import axios from "axios";
import './Users.css';

const PokemonUsers = () => {
    const [pokemonData, setPokemonData] = useState([]);

    useEffect(() => {
        fetchData();
    },[])

    const fetchData = () => {
        axios.get('http://localhost:4000/pokemon/all').then((response) => {
            console.log(response.data?.pokemons);
            setPokemonData(response.data?.pokemons);
        });
    }

    const deletePokemon = async (id) => {
        try{
            const response = await axios.delete(`http://localhost:4000/pokemon/delete/${id}`)
            console.log(response);
            fetchData();
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <div>
            <h1>List of Pokemon Users</h1>
            <button>Delete All</button>
            <table>
                <thead>
                    <tr>
                        <th>Pokemon Owner Name</th>
                        <th>Pokemon Name</th>
                        <th>Pokemon Ability</th>
                        <th>No.of Pokemon</th>
                        <th>Add Pokemon</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {pokemonData.map((pokemon) => (
                        <tr key={pokemon._id}>
                            <td>{pokemon?.owner?.pokemonOwnerName}</td>
                            <td>{pokemon?.pokemonName}</td>
                            <td>{pokemon?.pokemonAbility}</td>
                            <td>1</td>
                            <td>+</td>
                            <td><button>edit</button></td>
                            <td><button onClick={() => deletePokemon(pokemon._id)}>delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PokemonUsers;