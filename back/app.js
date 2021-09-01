import express from 'express';

const app = express();

app.use('*', (request, response) => {
    response.status(200).send('dkvbiek');
});

app.listen(5000, () => {
    console.log('--- run http://localhost:5000 ---');
});