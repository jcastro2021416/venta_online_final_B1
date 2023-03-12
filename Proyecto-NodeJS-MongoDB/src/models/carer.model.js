'use strict'

const mongose = require("mongoose");
const Schema = mongose.Schema;

const CarerSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    Numbercel:{ 
        type: Number,
        required: false
    },
    animalsInCharge: [{
        nameAnimal: String, 
        especie: String, 
        ageAnimal: Number,
    }],
});

module.exports = mongose.model('carer', CarerSchema);
//Como agregar datos a un arreglo en mongodb