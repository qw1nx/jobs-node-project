require('dotenv').config();

const express = require('express');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes')
const port = process.env.PORT;


start();

async function start(){
    const app = express();


    expressConfig(app);
    await databaseConfig(app)
    routesConfig(app);
    app.get('/', (req, res) =>{

        console.log(req.session);
        res.render('home', { layout: false});
    });

    app.get('*', (req, res) => {
        res.render('404');
    });

    //app.listen(port, ()=>console.log("Server running on port ", port));
    module.exports = app;
}
