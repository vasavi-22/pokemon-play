import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pokemonName: {
    type: String,
    required: true
  },
  pokemonAbility: {
    type: String,
    required: true
  },
  pokemonCount : {
    type: Number,
    required: true,
    default: 1,
  },
  initialPositionX: {
    type: Number,
    required: true
  },
  initialPositionY: {
    type: Number,
    required: true
  },
  speed: {
    type: Number,
    required: true
  },
  direction: {
    type: String,
    required: true,
    enum: ['up', 'down', 'left', 'right'] 
  }
});

const Pokemon = mongoose.model('Pokemon',PokemonSchema);
export default Pokemon;