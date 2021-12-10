import hasMutation from './dna.js';
import express from 'express';
import { createClient } from 'redis';

const app = express();
const port = 3000;
const client = createClient();
client.connect();

client.on('error', (err) => console.log('Redis Client Error', err));
app.use(express.json());

app.post('/mutation', async (req, res) => {
    let result = false;
    if (req.body.dna && Array.isArray(req.body.dna)) {
        const value = await client.get(req.body.dna.join(''));
        if (value) {
            return res.status(value === 'true' ? 200 : 403).send();
        }
        result = hasMutation(req.body.dna);
        if (result) {
            const count_mutations = parseInt(await client.get('count_mutations') || 0, 10);
            await client.set('count_mutations', (count_mutations + 1).toString());
        } else {
            const count_no_mutation = parseInt(await client.get('count_no_mutation') || 0, 10);
            await client.set('count_no_mutation', (count_no_mutation + 1).toString());
        }
        await client.set(req.body.dna.join(''), result.toString());
    }
    res.status(result ? 200 : 403).send();
});

app.get('/stats', async (req, res) => {
    const count_mutations = await client.get('count_mutations') || 0;
    const count_no_mutation = await client.get('count_no_mutation') || 0;
    res.send({
        count_mutations,
        count_no_mutation,
        ratio: count_mutations / count_no_mutation,
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
