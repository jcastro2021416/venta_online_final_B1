'use strict' //Es par usar el modo estricto JS

require('dotenv').config(); //Package-lock
const database = process.env.DATABASE;

const mongoose = require("mongoose");
mongoose.set('strictQuery', true); //Establecemos que mongoose va usar el modo estricto

const connection = async() =>{
    try{
        await mongoose.connect(database); // Espere a la coneccion de mongoose
        console.log("Conexion a la db exitosa :3")
    }catch(err){
        throw new Error(err);
    }
}

module.exports = {
    connection,
}

