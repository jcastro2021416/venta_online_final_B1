'use strict'

const {Router} = require('express'); //Contiene metodo http
const { createCurses, listCourses, deleteCourses, updateCourses, cursoProfesor } = require('../controller/courseController');
const api = Router();
api.post('/create-curse', createCurses);
api.get('/list-curse', listCourses);
api.delete('/delete-curse/:id', deleteCourses);
api.put('/update-curse/:id', updateCourses);
api.post('asign-teacher/:name/teacher/:username', cursoProfesor);

module.exports = api;




