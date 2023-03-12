'use strict'

const express = require('express');
const app = express();
const {connection} = require('./src/database/connection');
require('dotenv').config();
const port = process.env.PORT;
const routesE = require("./src/routers/empresa.routes")

connection(); //

app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use('/api', routesE);

app.listen(port, () =>{
    console.log(`Servidor esta corriendo de forma correcta en el puerto ${port} :)`);
})
