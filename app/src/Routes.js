import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Structure/Layout";
import Home from './Components/Home/Home';
import AddPokemon from "./Components/AddPokemon/AddPokemon";
import PokemonUsers from "./Components/PokemonUsers/PokemonUsers";

const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/add" element={<AddPokemon />} />
                <Route path="/users" element={<PokemonUsers />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;