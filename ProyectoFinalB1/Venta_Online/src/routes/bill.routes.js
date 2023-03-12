'use strict'

const {Router} = require('express');
const { addToCart, listCart, buy, listShop, BuyProduct } = require('../controller/billController');
const {validateJWT} = require("../middlewares/validate-jwt");

const api = Router();

api.post('/addCart', validateJWT, addToCart)
api.get('/listCart', validateJWT, listCart)
api.post('/buy', validateJWT, buy)
api.get('/listShop', validateJWT, listShop)
api.get('/buy-product', validateJWT, BuyProduct)
module.exports = api;


