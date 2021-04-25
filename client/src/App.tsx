import React, { useEffect, useState } from 'react';
import './App.css';

export interface Pokemon {
  id: number;
  name: string;
  level: number;
  type: 'Water' | 'Fire' | 'Plant' | 'Normal';
  attacks: {
    name: string;
    damage: number;
    type: 'Water' | 'Fire' | 'Plant' | 'Normal';
  }[];
  hp: number;
}

const missingNo: Pokemon = {
  id: -Infinity,
  name: 'MissingNo',
  level: 0,
  type: 'Normal',
  attacks: [],
  hp: 0,
};

function App() {
  const [pokemons, updatePokemons] = useState([missingNo]);
  useEffect(() => {
    const setPokemonsFromServer = async () => {
      const getPokemonsResponse = await fetch('http://localhost:3001', {
        method: 'GET',
      });
      const pokemons: Pokemon[] = await getPokemonsResponse.json();
      updatePokemons(pokemons);
    };
    setPokemonsFromServer();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <PokemonList pokemons={pokemons}></PokemonList>
      </header>
    </div>
  );
}

function PokemonList(props: { pokemons: Pokemon[] }) {
  const listItems = props.pokemons.map((pokemon) => <li>{pokemon.name}</li>);
  return <ul>{listItems}</ul>;
}

// delete a pokemon from the list
// show a page for a single pokemon (Details page)
// create a new pokemon

export default App;
