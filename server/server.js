import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { config } from "./src/config/index.js";
import user from './src/routes/user.route.js';
import pokemon from './src/routes/pokemon.route.js';

const app = express();
app.use(express.json());

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow your frontend's origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.get('/',(req,res) => res.send('hello world'));
app.use('/user',user);
app.use('/pokemon',pokemon);

( async () => {
    try {
        await mongoose.connect(config.DATABASE);
        console.log("MongoDB connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server starts at port ${config.PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
})()