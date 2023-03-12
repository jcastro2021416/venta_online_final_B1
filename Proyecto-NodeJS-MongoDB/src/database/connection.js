'use strict'

    require("dotenv").config(); //Sirve para usar variables de entorno
    const database=process.env.DATABASE; //Todo junto sin espacion si o si
const mongoose = require("mongoose"); //require nos permite agregar modulos centrales integrados, modulos locales y basado en la omunidad
mongoose.set("strictQuery", true); //modo estricto en mongobd

const connection = async () =>{ //async por si el servidor se tarda en responder se lo demos a mongodb para que lo espere
    try{
        /*await es para que cuando se este haciendo la peticion a mongodb se espere a que la peticion regrese a que 
        retorne una peticion correcto o sino dara error*/
        await mongoose.connect(database);
        console.log('Conectado a la base de datos!');
    }catch(err){
        throw new Error(err);
    }
};

/*Como estamos trabajando en un api cada funcion que hacemos es un modulo*/
module.exports = {
    connection,
};

/*Asyncronismo => Ejecuta de arriba hacia abajo y no le importa nada
pero entonces si el servido aun no a respuesto y js ya paso de linea va a tirar error
entonces cuando llegue con el `await` y con el `async` le decimos que espere al servidor
para seguir ejecutando el codigo*/