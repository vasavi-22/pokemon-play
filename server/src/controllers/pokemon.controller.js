import Pokemon from "../models/pokemon.model.js";
import User from "../models/user.model.js";

export const addPokemon = async (req, res) => {
    const { pokemonOwnerName, pokemonName, pokemonAbility, pokemonCount, initialPositionX, initialPositionY, speed, direction } = req.body;

    if (!pokemonOwnerName || !pokemonName || !pokemonAbility || !pokemonCount || initialPositionX === undefined || initialPositionY === undefined || !speed || !direction) {
        return res.status(400).json({
            message: 'Details missing'
        });
    }

    try {
        let user = await User.findOne({pokemonOwnerName});

        if(!user){
            // Create new user if not found
            user = new User({pokemonOwnerName});
            await user.save();

            // res.status(400).json({
            //     message : "User not found"
            // });
        }

        const newPokemon = new Pokemon({ owner: user._id, pokemonName, pokemonAbility, pokemonCount, initialPositionX, initialPositionY, speed, direction });
        await newPokemon.save();

        return res.status(201).json({
            message: "Pokemon created successfully",
            pokemon: newPokemon
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getPokemons = async (req,res) => {
    try{
        // using .populate() to fetch owner details
        const allPokemon = await Pokemon.find().populate('owner', 'pokemonOwnerName');

        res.status(200).json({
            message : 'Fetched pokemons',
            pokemons : allPokemon
        })
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}

export const deletePokemon = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: 'Pokemon ID not found'
        });
    }

    try {
        const deletedPokemon = await Pokemon.findByIdAndDelete(id);
        if (!deletedPokemon) {
            return res.status(404).json({
                message: 'Pokemon not found'
            });
        }
        return res.status(200).json({
            message: 'Pokemon deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const editPokemon = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    console.log(updateData,"update data");

    if (!id) {
        return res.status(400).json({
            message: 'Pokemon ID not found'
        });
    }

    try {
        const updatedPokemon = await Pokemon.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPokemon) {
            return res.status(404).json({
                message: 'Pokemon not found'
            });
        }
        return res.status(200).json({
            message: 'Pokemon updated successfully',
            pokemon: updatedPokemon
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const deleteAllPokemons = async (req,res) => {
    try{
        await Pokemon.deleteMany({});
        res.status(200).json({
            message : 'All pokemons have been deleted'
        });

    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}