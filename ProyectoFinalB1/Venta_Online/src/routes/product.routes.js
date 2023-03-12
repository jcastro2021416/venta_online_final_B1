'use strict'

const {Router} = require('express');
const {check} = require('express-validator');
const {validateParams} = require('../middlewares/validate-params');
const {validateJWT} = require("../middlewares/validate-jwt");
const { createProduct, listProducto, readProductByName, deleteProduct, updateProduct, productSoldOut } = require('../controller/productController');
const api = Router();

api.post('/create-product', validateJWT ,createProduct);
api.get('/list-product', validateJWT, listProducto);
api.get('/read-product-Name', validateJWT, readProductByName);
api.delete('/delete-product/:id', validateJWT, deleteProduct);
api.put('/product-update/:id', validateJWT, updateProduct);
api.get('/product-soldout', validateJWT, productSoldOut);

module.exports = api;





