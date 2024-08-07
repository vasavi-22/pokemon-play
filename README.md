# Pokemon Play Application : 

## To run the application on local machine

- Clone the repository from github

- To run the backend :
    - cd server (Backend directory)
    - npm install ( to install all the dependencies )
    - node server.js (server starts at localhost:4000)

- To run the frontend : 
    - cd app (Frontend directory)
    - npm install
    - npm start ( starts the application at localhost:3000)

# Pokemon Play Application : 

#### Home page :
    - Dropdown list you down the available users, select the user to list his pokemons.
    - Table shows the pokemons respective to the user selected in the dropdown, each row includes the details of the pokemon(Pokemon Name, Pokemon Ability, Number of Pokemon, InitialPositionX, InitialPositionY, Speed and Direction).
    - Select the pokemon in the table you want to play.
    - Pokemon Go, Pokemon Flee, Pokemon Freeze - Are the pokemon controls.
    - Pokemon Go : Moves the pokemon starting from it's original position with the given speed towards the given direction.
    - Pokemon Flee : It acts as a toggle to vanish and appear the pokemon in its current position.
    - Pokemon Freeze : Make the pokemon freeze in its current position, and can unfreeze it.

#### Add Pokemon Page :
    - Provide the details to create new pokemon.
    - Pokemon Name should be selected from the pre-fetched pokemon names from the pokemon-api ( https://pokeapi.co/api/v2/pokemon-species/ ).
    - Pokemon Ability will be filled automatically.
    - After creating the new pokemon, it reflects in the pokemons list.

#### List of Pokemon Users Page : 
    - List down the available users and their pokemons.
    - Each pokemons has controls - Add pokemon, Edit Pokemon, Delete Pokemon.
    - Once you click on the Add Pokemon (plus icon), it navigates to another page, there you will be asked to modify the count of the pokemon. Remaining fields on the page are pre-selected (read only).


## Technologies Used : 

#### Frontend : 
    - ReactJS
    - libraries - react-router-dom, axios, primereact UI, sweetalert2, font-awesome icons, 

#### Backend :
    - Node with ExpressJS
    - libraries - express, mongoose, cors, dotenv

#### Data Storage :
    - MongoDB Atlas


