'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema({
    name: String,
    description: String,
    productos: [{type: Schema.Types.ObjectId, ref: 'Products'}],
})

module.exports = mongoose.model('Categorys', categorySchema)


