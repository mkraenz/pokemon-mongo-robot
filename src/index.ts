import express from 'express';
import { Collection, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

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

// const uri = 'mongodb://localhost:27017';

const getPokemonNames = (pokemons: Pokemon[]) => {
    return pokemons.map((pokemon) => pokemon.name);
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
    let client: MongoClient;
    const app = express();
    app.use(express.json());
    const port = 3000;
    try {
        const { uri } = await setupMongoDbMemoryServer();

        // https://en.wikipedia.org/wiki/Representational_state_transfer REST API

        client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();
        const database = await client.db('pokemon');
        const pokemonsCollection = database.collection<Pokemon>('pokemons');
        // testing?
        await createOne(pokemonsCollection, {
            name: 'Bulbasaur',
            level: 30,
            hp: 50,
            type: 'Plant',
            attacks: [{ name: 'tackle', damage: 5, type: 'Normal' }],
            id: 123,
        });
        // important? await findAll(pokemonsCollection);

        app.get('/', function (req, res) {
            console.log('Got a GET request for the homepage');
            res.send(findAll(pokemonsCollection));
        });

        app.get('/:id', function (req, res) {
            console.log('Got a GET request for /list_user');
            res.send(
                findOne(pokemonsCollection, {
                    id: parseInt(req.params.id),
                }) || {
                    name: 'Missingno.',
                }
            );
        });
        app.delete('/:id', async function (req, res) {
            // pokemons = pokemons.filter(
            //     (pokemon) => pokemon.id !== parseInt(req.params.id)
            // );
            deleteOne(pokemonsCollection, { id: parseInt(req.params.id) });
            console.log('Got a DELETE request for /del_user');
            res.send(getPokemonNames(await findAll(pokemonsCollection)));
        });

        app.post('/', async function (req, res) {
            getNewPokemonId(pokemonsCollection);
            const body: Omit<Pokemon, 'id'> = req.body;
            const id = await getNewPokemonId(pokemonsCollection);
            const newPokemon: Pokemon = { ...body, id: id };
            if (isPokemon(newPokemon)) {
                createOne(pokemonsCollection, newPokemon);
            } else {
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
                res.status(400).send('Pokemon name is not working!');
            }
            console.log('Got a POST request for the homepage');
            res.send(getPokemonNames(await findAll(pokemonsCollection)));
        }); // DELETE localhost:3000/6
        // -> req.params.id = 6
        app.listen(port, function () {
            const host = 'localhost';

            console.log(`Example app listening at http://${host}:${port}`);
        });
        // important?    console.dir(pokemons, { depth: Infinity });
    } finally {
        // Ensures that the client will close when you finish/error
        await client!.close();
    }
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

//  ? async function updateOne() {}

async function deleteOne(
    collection: PokemonCollection,
    options: Partial<Pokemon>
) {
    collection.deleteOne(options);
}

run().catch(console.dir);
