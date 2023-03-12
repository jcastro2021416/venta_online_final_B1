'use strict'

const {Router} = require('express');
const {check} = require('express-validator');
const {validateParams} = require('../middlewares/validate-params');
const {validateJWT} = require("../middlewares/validate-jwt");
const { createCategory, listCategory, readCategoryByName, updateCategory, deleteCategory } = require('../controller/categoryController');

const api = Router();

api.post('/create-category', validateJWT, createCategory);
api.get('/list-category', validateJWT, listCategory);
api.get('/list-categoryName', validateJWT, readCategoryByName);
api.put('/edit-category/:id', validateJWT, updateCategory);
api.delete('/delete-category/:id', validateJWT, deleteCategory);
module.exports = api;



