'use strict'

const mongose = require("mongoose");
const Schema = mongose.Schema;

const UserSchema = Schema({
    username: {
        type: String, //Tipo string
        required: true //Indica que si es requerido
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false,
    },
});

module.exports = mongose.model('users', UserSchema);