import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

enum PokemonTypes {
  Water = 'Water',
  Fire = 'Fire',
  Plant = 'Plant',
  Normal = 'Normal',
}
interface Pokemon {
  id: number;
  name: string;
  level: number;
  type: PokemonTypes;
  attacks: {
    name: string;
    damage: number;
    type: PokemonTypes;
  }[];
  hp: number;
}

const missingNo: Pokemon = {
  id: -Infinity,
  name: 'MissingNo',
  level: 0,
  type: PokemonTypes.Normal,
  attacks: [],
  hp: 0,
};
function App() {
  const [pokemons, updatePokemons] = useState([missingNo]);
  useEffect(() => {
    const setPokemonsFromServer = async () => {
      const { data: pokemons } = await axios.get<Pokemon[]>(
        'http://localhost:3001'
      );
      updatePokemons(pokemons);
    };
    setPokemonsFromServer();
  }, []);

  const addToPokeList = (newPokemon: Pokemon) => {
    updatePokemons([...pokemons, newPokemon]);
  };
  const removePokemon = (id: number) => {
    const newPokemons = pokemons.filter((pokemon) => pokemon.id !== id);
    updatePokemons(newPokemons);
  };
  return (
    <div className="App">
      <header className="App-header">
        <PokemonList pokemons={pokemons} removePokemon={removePokemon} />
        <PokemonForm addToPokeList={addToPokeList} />
      </header>
    </div>
  );
}

const getPokeTypeOptions = () => {
  return Object.values(PokemonTypes).map((type) => (
    <option value={type} key={type}>
      {type}
    </option>
  ));
};

function PokemonForm(p: { addToPokeList: (pokemon: Pokemon) => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<PokemonTypes>(PokemonTypes.Water);

  const addPokemon = async (data: Partial<Pokemon>) => {
    const newPokemon = {
      name: data.name || 'Picardtschuh',
      attacks: data.attacks || [],
      hp: data.hp || 42,
      level: data.level || -3,
      type: data.type,
    };
    const { data: createdPokemon } = await axios.post(
      'http://localhost:3001',
      newPokemon,
      { headers: { 'Content-Type': 'application/json' } }
    );
    p.addToPokeList(createdPokemon);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addPokemon({ name, type });
    setName('');
    setType(PokemonTypes.Water);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="Name">Name:</label>
      <br />
      <input
        type="text"
        onChange={(event) => {
          setName(event.target.value);
        }}
        value={name}
        name="Name"
      />
      <input type="submit" />
      <select onChange={(event) => setType(event.target.value as PokemonTypes)}>
        {getPokeTypeOptions()}
      </select>
    </form>
  );
}

function PokemonList(props: {
  pokemons: Pokemon[];
  removePokemon: (id: number) => void;
}) {
  const removePokemon = async (id: number) => {
    await axios.delete(`http://localhost:3001/${id}`);
    props.removePokemon(id);
  };
  const listItems = props.pokemons.map((pokemon) => (
    <li className="pokemon-item" key={pokemon.id}>
      <p style={{ display: 'inline' }}>{pokemon.name}</p>
      <div
        onClick={() => {
          removePokemon(pokemon.id);
        }}
        style={{ cursor: 'pointer' }}
      >
        <p style={{ color: 'red', width: 'bold' }}>X</p>
      </div>
    </li>
  ));
  return (
    <>
      {props.pokemons.length === 0 ? (
        <p>Nothing here yet</p>
      ) : (
        <ul>{listItems}</ul>
      )}
    </>
  );
}

// delete a pokemon from the list
// show a page for a single pokemon (Details page)
// create a new pokemon

export default App;
