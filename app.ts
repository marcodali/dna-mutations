import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

const mutation = (request: Request, response: Response) => {
    response.status(200).json('OK');
};

const stats = (request: Request, response: Response) => {
    response.status(200).json({
        count_mutations: 40,
        count_no_mutation: 100,
        ratio: 0.4
    });
};

app.post('/mutation', mutation);
app.get('/stats', stats);

app.listen(port, () => {
  console.log(`Genetic DNA differences application is running on port ${port}.`);
});