import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { config } from "./src/config/index.js";
import user from './src/routes/user.route.js';
import pokemon from './src/routes/pokemon.route.js';

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

// Use CORS with the options defined
app.use(cors(corsOptions));

app.options('*', cors(corsOptions), (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.sendStatus(200);
});

app.use(express.json());

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