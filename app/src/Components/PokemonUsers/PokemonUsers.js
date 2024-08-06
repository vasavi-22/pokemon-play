import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import styles from './PokemonUsers.module.css';
import { useNavigate } from "react-router-dom";

const PokemonUsers = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonAbility, setPokemonAbility] = useState("");
  const [id, setId] = useState("");
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("/pokemon/all").then((response) => {
      setPokemonData(response.data?.pokemons);
    });
  };

  const editPokemon = (pokemon) => {
    setPokemonName(pokemon.pokemonName);
    setPokemonAbility(pokemon.pokemonAbility);
    setId(pokemon._id);
    setVisible(true);
  };

  const updatePokemon = async (e) => {
    e.preventDefault();
    const updated = { pokemonName, pokemonAbility };

    try {
      const response = await axios.put(
        `/pokemon/edit/${id}`,
        updated
      );
      fetchData();

      setPokemonName("");
      setPokemonAbility("");
      setId(null);
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePokemon = async (id) => {
    try {
      const response = await axios.delete(
        `/pokemon/delete/${id}`
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        "/pokemon/delete"
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const addPage = (pokemon) => {
    navigate(`/add/${pokemon._id}`, { state: { pokemon } });
  };

  return (
    <div className={styles.usersDiv}>
      <h1>List of Pokemon Users</h1>
      <button className={styles.deleteAll} onClick={handleDelete}>
        Delete All
      </button>
      <table className={styles.tableContainer}>
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
          {pokemonData.length > 0 ? (
            pokemonData.map((pokemon) => (
              <tr key={pokemon._id}>
                <td>{pokemon?.owner?.pokemonOwnerName}</td>
                <td>{pokemon?.pokemonName}</td>
                <td>{pokemon?.pokemonAbility}</td>
                <td>{pokemon?.pokemonCount}</td>
                <td>
                  <FontAwesomeIcon 
                  icon={faPlus} 
                  onClick={() => addPage(pokemon)}
                  className={styles.icon} />
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => editPokemon(pokemon)}
                    className={styles.icon}
                  />
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() => deletePokemon(pokemon._id)}
                    className={styles.icon}
                  />
                </td>
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

      <Dialog
        className={styles.editPokemon}
        header="Edit Pokemon Details"
        visible={visible}
        onHide={() => {
          setVisible(false);
          setPokemonName("");
          setPokemonAbility("");
        }}
        footer={
          <div className={styles.footerDiv}>
            <Button label="Save" onClick={updatePokemon} autoFocus />
            <Button
              label="Cancel"
              onClick={() => {
                setVisible(false);
                setPokemonName("");
                setPokemonAbility("");
              }}
            />
          </div>
        }
      >
        <form>
          <input
            type="text"
            placeholder="Pokemon Name"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            required
          />
          <br />
          <input
            type="text"
            placeholder="Pokemon Ability"
            value={pokemonAbility}
            onChange={(e) => setPokemonAbility(e.target.value)}
            required
          ></input>
        </form>
      </Dialog>
    </div>
  );
};

export default PokemonUsers;
