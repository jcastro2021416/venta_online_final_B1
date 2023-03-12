'use strict'

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: String,
    age: String,
    email:String,
    carnet: Number,
    rol:String,
    password: String,
    curses: [{
        type: Schema.Types.ObjectId, ref: 'Courses'
    }]
});

module.exports = mongoose.model('Usuarios', UserSchema)