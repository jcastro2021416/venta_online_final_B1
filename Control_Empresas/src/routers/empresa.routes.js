'use strict'

const {Router} = require('express');
const{ createEmpresa, readEmpresa, deleteEmpresa, updateCompany, loginCompany, addEmpresas, deleteSucursal, updateSucursal} = require("../controller/empresaController");

const api = Router();
api.post('/create-company', createEmpresa)
api.get('/read-company', readEmpresa)
api.delete('/delete-company/:id', deleteEmpresa)
api.put('/update-company/:id', updateCompany)
api.post('/login-company', loginCompany)
api.put('/sucursal/:id', addEmpresas)
api.delete('/delete-sucursal/:id', deleteSucursal)
api.put('/update-sucursal/:id', updateSucursal)

module.exports = api;

