import { Router } from "express";
import { addPokemon, deletePokemon, editPokemon, getPokemons } from "../controllers/pokemon.controller.js";

const router = Router();

router.get('/all',getPokemons);
router.post('/add',addPokemon);
router.patch('/edit/:id',editPokemon);
router.delete('/delete/:id',deletePokemon);

export default router;