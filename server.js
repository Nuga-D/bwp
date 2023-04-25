const express = require('express');

const config = require('./config');
const router = require('./src/index');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/v1/', router);


const server = app.listen(config.port, () => {
    console.log('Listening on port', config.port);
})


module.exports = server;