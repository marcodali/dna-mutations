import express from 'express';
import { createClient } from 'redis';

const app = express();
const port = 3000;
const client = createClient();
client.connect();

client.on('error', (err) => console.log('Redis Client Error', err));
app.use(express.json());
const secret = 'myverysecretword';

const myMiddleware = (req, res, next) => {
    const secretFromHeaders = req.headers['secret'];
    if (secret !== secretFromHeaders) {
        return res.status(401).send();
    }
    next();
};

app.post('/like', myMiddleware, async (req, res) => {
    const { username, imageurl, like } = req.body;
    if (like) {
        Promise.all([
            client.sAdd(imageurl, username),
            client.sAdd('images', imageurl),
        ])
    } else {
        await client.sRem(imageurl, username);
    }
    return res.status(200).send();
});

app.get('/launchimages', async (req, res) => {
    const images = await client.sMembers('images');
    res.send(images);
});

app.get('/launchimagesprivate', myMiddleware, async (req, res) => {
    const images = await client.sMembers('images');
    const imagesLikes = await Promise.all(images.map((image) => client.sMembers(image)));
    const result = imagesLikes.map((likes, index) => {
        return { url: images[index], likes };
    })
    res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
