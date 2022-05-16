require('dotenv').config();

const express = require('express');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes')
const port = process.env.PORT || 3000;


start();

async function start(){
    const server = express();


    expressConfig(server);
    await databaseConfig(server)
    routesConfig(server);
    server.get('/', (req, res) =>{

        console.log(req.session);
        res.render('home', { layout: false});
    });

    server.get('*', (req, res) => {
        res.render('404');
    });

    server.listen(port, ()=>console.log("Server running on port ", port));
    module.exports = server;
}
