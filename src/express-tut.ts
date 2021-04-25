// import express from 'express';
// import { Pokemon } from '.';

// const port = 3000;

// const app = express();

// app.use(express.json());

// let pokemons: Pokemon[] = [];
// let id = 1;

// const getPokemonNames = (pokemons: Pokemon[]) => {
//     return pokemons.map((pokemon) => pokemon.name);
// };

// // browser  <-> app <-> database
// //              app <-> database
// // browser  <-> app

// app.get('/', function (req, res) {
//     console.log('Got a GET request for the homepage');
//     res.send(pokemons);
// });

// const isPokemon = (data: any) => {
//     const hasName =
//         typeof data.name === 'string' && legalDepartmentApproves(data.name);
//     return hasName;
// };

// // https://en.wikipedia.org/wiki/Representational_state_transfer REST API
// app.post('/', function (req, res) {
//     const body: Omit<Pokemon, 'id'> = req.body;
//     const newPokemon: Pokemon = { ...body, id: id };
//     if (isPokemon(newPokemon)) {
//         pokemons.push(newPokemon);
//         id++;
//     } else {
//         // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
//         res.status(400).send('Pokemon name is not working!');
//     }
//     console.log('Got a POST request for the homepage');
//     res.send(getPokemonNames(pokemons));
// });

// // DELETE localhost:3000/6
// // -> req.params.id = 6
// app.delete('/:id', function (req, res) {
//     pokemons = pokemons.filter(
//         (pokemon) => pokemon.id !== parseInt(req.params.id)
//     );
//     console.log('Got a DELETE request for /del_user');
//     res.send(getPokemonNames(pokemons));
// });

// app.get('/:id', function (req, res) {
//     console.log('Got a GET request for /list_user');
//     res.send(
//         pokemons.find((pokemon) => pokemon.id === parseInt(req.params.id)) || {
//             name: 'Missingno.',
//         }
//     );
// });

// app.listen(port, function () {
//     const host = 'localhost';

//     console.log(`Example app listening at http://${host}:${port}`);
// });

// function legalDepartmentApproves(name: string) {
//     const illegalNames = [''];
//     return !illegalNames.includes(name);
// }
// // http://localhost:3000/

// // Browser -> open URL -> send GET localhost:3000
// // -> server receives GET request to localhost:3000
// // ->
