'use strict'

const express = require("express");
const { Router } = require("express");
const { createCarer, listCarer, deleteCare, updateCarer } = require('../controllers/carer.controller');

const api = Router();

api.post('/create-carer', createCarer);
api.get('/list-carer', listCarer)
api.delete('/delete-carer/:id', deleteCare);
api.put('/edit-carer/:id', updateCarer);


module.exports = api;