'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmpresaSchema = Schema({
    name_company: String,
    company_type: String,
    email: String,
    password: String,
    branch_offices: [{
        detailed_location: String,
        municipality: String
    }]
})

module.exports = mongoose.model('Empresas', EmpresaSchema)
