'use strict'

require('dotenv').config(); //Package-lock
const database = process.env.DATABASE; 

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connection = async() => {
try{
    await mongoose.connect(database);
    console.log("Conexion a la db exitosa")
}catch(err){
    throw new Error(err);
}
};

module.exports = {
    connection,
}



