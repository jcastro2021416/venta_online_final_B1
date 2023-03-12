'use strict'

const { Router } = require("express"); /*Importamos {Router}* que nos permite usar los metodos http como get post delete put
y que viene de express*/
const { createUser, listUsers, updateUser, deleteUser, loginUser } = require('../controllers/user.controller');
const {validateParams} = require("../middlewares/validate-params");
const {validateJWT} = require("../middlewares/validate-jwt")
const {check} = require("express-validator");



const api = Router(); 
api.post('/create-user', [validateJWT, check("username", "El username es obligatorio").not().isEmpty(), 
check("password", "El password debe de ser mayor a 6 digitos").isLength({min: 6}),
check('email', 'El email es obligatorio').not().isEmpty(),
validateParams,]
,createUser);  /*Primer declaramos la ruta de entrada y luego importamos la funcion*/
api.get('/list-users',listUsers); /*Primer declaramos la ruta de entrada y luego importamos la funcion*/
api.put('/update-user/:id', [
    validateJWT,
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 digitos").isLength({
      min: 6,
    }),
    check("email", "El email es obligatorio").not().isEmpty(),
    validateParams,
  ],updateUser); /*Primer declaramos la ruta de entrada y luego importamos la funcion*/
api.delete('/delete-user/:id',validateJWT, deleteUser); /*Primer declaramos la ruta de entrada y luego importamos la funcion*/
api.post('/login', loginUser);

module.exports = api; /*Para que todo lo que use la constante `api` todo lo que haga referencia lo podamos usar*/