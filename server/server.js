import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { config } from "./src/config/index.js";
import user from './src/routes/user.route.js';
import pokemon from './src/routes/pokemon.route.js';
import path from "path";

const app = express();

const corsOptions = {
    origin: '*', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

// Use CORS with the options defined
app.use(cors(corsOptions));

app.options('*', cors(corsOptions), (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.sendStatus(200);
});

app.use(express.json());

// app.get('/',(req,res) => res.send('hello world'));
app.use('/user',user);
app.use('/pokemon',pokemon);



// production 
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname1, '..', '/client/build'); 
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API RUNNING SUCCESSFULLY');
  });
}


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


