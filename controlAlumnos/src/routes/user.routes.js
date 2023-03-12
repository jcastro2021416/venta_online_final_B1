'use strict'

const {Router} = require('express'); //Contiene metodo http
const { CreateUser, deleteUser, listUser, UpdateUser, AsignCourses, loginUser } = require('../controller/userController');
const api = Router();
api.post('/create-user', CreateUser);
api.get('/list-user', listUser);
api.delete('/delete-user/:id', deleteUser);
api.put('/update-user/:id', UpdateUser)
api.put('asign-course', AsignCourses)
api.post('/login-user', loginUser);

module.exports = api;