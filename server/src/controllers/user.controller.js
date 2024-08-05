import User from '../models/user.model.js';

export const addUser = async (req, res) => {
    const { pokemonOwnerName } = req.body;

    if (!pokemonOwnerName) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    try {
        const newUser = new User({ pokemonOwnerName });
        await newUser.save();
        return res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getUsers = async (req,res) => {
    try{
        const allUser = await User.find();

        res.status(200).json({
            message : "Fetched users",
            users : allUser
        })
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}
