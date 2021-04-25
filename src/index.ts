import cors from 'cors';
import express from 'express';
import { Collection, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import morgan from 'morgan';

const setupMongoDbMemoryServer = async () => {
  const mongod = new MongoMemoryServer();

  const uri = await mongod.getUri();
  const port = await mongod.getPort();
  const dbPath = await mongod.getDbPath();
  const dbName = await mongod.getDbName();
  return { uri, port, dbPath, dbName };
};

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

type PokemonCollection = Collection<Pokemon>;

const getPokemonNames = (pokemons: Pokemon[]) => {
  return pokemons.map((pokemon) => pokemon.name);
};
const getPokemonNamesIds = (pokemons: Pokemon[]) => {
  return pokemons.map((pokemon) => ({ name: pokemon.name, id: pokemon.id }));
};

function legalDepartmentApproves(name: string) {
  const illegalNames = [''];
  return !illegalNames.includes(name);
}

const isPokemon = (data: any) => {
  const hasName =
    typeof data.name === 'string' && legalDepartmentApproves(data.name);
  return hasName;
};

async function run() {
  const port = 3001;
  const app = express();
  app.use(express.json());
  app.use(morgan('tiny'));
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
    })
  );
  // const { uri } = await setupMongoDbMemoryServer();
  const uri = 'mongodb://localhost:27017';

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  const database = client.db('pokemon');
  const pokemonsCollection = database.collection<Pokemon>('pokemons');

  app.get('/', async function (req, res) {
    const pokemonNames = getPokemonNamesIds(await findAll(pokemonsCollection));
    return res.send(pokemonNames);
  });

  app.get('/:id', async function (req, res) {
    const requestedPokemon = (await findOne(pokemonsCollection, {
      id: parseInt(req.params.id),
    })) || {
      name: 'Missingno.',
    };
    res.send(requestedPokemon);
  });

  app.delete('/:id', async function (req, res) {
    deleteOne(pokemonsCollection, { id: parseInt(req.params.id) });
    res.send(getPokemonNames(await findAll(pokemonsCollection)));
  });

  app.post('/', async function (req, res) {
    const body: Omit<Pokemon, 'id'> = req.body;
    const id = await getNewPokemonId(pokemonsCollection);
    const newPokemon: Pokemon = { ...body, id: id };
    if (isPokemon(newPokemon)) {
      await createOne(pokemonsCollection, newPokemon);
    } else {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
      res.status(400).send('Pokemon name is not working!');
    }
    res.send(getPokemonNames(await findAll(pokemonsCollection)));
  });

  app.listen(port, function () {
    console.log(`App listening at http://localhost:${port}`);
  });
}

async function getNewPokemonId(collection: PokemonCollection) {
  return (
    (await findAll(collection))
      .map((pokemon) => pokemon.id)
      .reduce((max, cur) => (max < cur ? cur : max), 0) + 1
  );
}

async function findAll(collection: PokemonCollection) {
  return collection.find({}).toArray();
}

async function findOne(
  collection: PokemonCollection,
  options: Partial<Pokemon>
) {
  return collection.findOne(options);
}

async function createOne(
  collection: PokemonCollection,
  pokemon: Pokemon
): Promise<Pokemon> {
  return (await collection.insertOne(pokemon)).ops[0];
}

async function deleteOne(
  collection: PokemonCollection,
  options: Partial<Pokemon>
) {
  collection.deleteOne(options);
}

run().catch(console.dir);
