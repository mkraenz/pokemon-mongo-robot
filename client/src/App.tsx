import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';

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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <code>{JSON.stringify(pokemons, null, 2)}</code>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
