import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import AddPokemon from "./components/AddPokemon";
import PokemonUsers from "./components/PokemonUsers";

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