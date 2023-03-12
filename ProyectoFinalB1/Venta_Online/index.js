'use strict'

const express = require('express');
const app = express();
const {connection} = require('./src/database/connection');
require('dotenv').config();
const port = process.env.PORT;
const routesU = require("./src/routes/user.routes")
const routesP = require("./src/routes/product.routes")
const routesC = require("./src/routes/category.routes")
const routesB = require("./src/routes/bill.routes")
const {defaultUser} = require('./default')

connection();

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/api', routesU, routesP, routesC, routesB)

app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto exitosamente ${port}`);
})

defaultUser();
