'use strict' //Modo estricto de JS

const express = require("express");
const app = express(); //La comstanter app hace referecia a express ya esta haciendo referencia a nuestro servidor
const {connection} = require("./src/database/connection");
/*Encerramos dentro de llaves {connection} porque podemos meter todas las funciones que exportemos dentro de connection*/
require("dotenv").config();
const port = process.env.PORT;
const routes = require('./src/routes/user.routes') 
//const routes = require('./src/routes/student.routes')

//base de datos
connection();

//MIDOLEWARES
/*Funciona para que cuando le enviemos datos identifique que sea texto plano*/
app.use(express.urlencoded({extended : false}))

app.use(express.json());

app.use('/api', routes); /*primera nuestra primera linea de entrada para que podamos user /create-user
y routes para que use todas las rutas*/


app.listen(port, function(){ //app.listen => Nos pide un puerto para escuchar peticiones 
    console.log(`el servidor esta corriendo en el puerto :) ${port}`)
});







