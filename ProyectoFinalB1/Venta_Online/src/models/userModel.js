'use strict'

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    rol: {
        type: String,
        enum: ['ADMIN', 'CLIENT'], default: 'CLIENT',
    },
    carrito: [
        {
            nombre: {type: Schema.Types.ObjectId, ref: 'Products'},
            cantidad: {type: Number},
            fecha: {type: Date, default: Date.now}
        }
    ]
});
//require => Carga un modulo en nuestro archivo
//Enum = se utiliza para definir lista de valores en un campo String
module.exports = mongoose.model('Users', UserSchema)







