import { Collection, MongoClient } from 'mongodb';

interface Pokemon {
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

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = await client.db('pokemon');
    const pokemons = database.collection<Pokemon>('pokemons');
    await createOne(pokemons, {
      name: 'Bulbasaur',
      level: 30,
      hp: 50,
      type: 'Plant',
      attacks: [{ name: 'tackle', damage: 5, type: 'Normal' }],
    });
    const pkms = await findAll(pokemons);
    console.dir(pkms, { depth: Infinity });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
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

async function updateOne() {}

async function deleteOne() {}

run().catch(console.dir);
