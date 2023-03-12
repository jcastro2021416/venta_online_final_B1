'use strict'

const mongoose = require("mongoose") //Viene de la libreria mongoose
const Schema = mongoose.Schema;

const productSchema = Schema ({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: {type: Schema.Types.ObjectId, ref: 'Categorys'}
});

module.exports = mongoose.model('Products', productSchema)

