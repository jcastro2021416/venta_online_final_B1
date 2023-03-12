'use strict'

const Courses = require("../models/coursesModel");
const Usuarios = require('../models/userModel');

const createCurses = async(req, res) =>{
    const {teacher, asignCourse} = req.body;
    try{
        let curse = await Courses.findOne({asignCourse});
        if(curse){
            return res.status(400).send({
                message: 'El curso ya tiene un profesor asignado',
                ok: false,
                curse: curse,
            });
        }
        curse = new Courses(req.body);
        curse = await curse.save();

        res.status(200).send({
            message: `Curso asignado correctamente a ${teacher}`,
            ok: true,
            curse: curse,
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            ok: false,
            message: `No se a creado el curso por el profesor ${teacher}`,
            error: err,
        })
    }
}

//---------------------------List---------------------
const listCourses = async(req, res) =>{
    try{
        const courses = await Courses.find();

        if(!courses){
            res.status(400).send({msg: 'No hay cursos disponibles'})
        }else{
            res.status(200).send({cursos_obtenidos: courses})
        }
    }catch(err){
        throw new Error ('Error al listar cursos')
    }
} 

//--------------------------Delete-----------------------------------
const deleteCourses = async(req, res) =>{
    try{
        const id = req.params.id;
        const result = await Courses.findByIdAndDelete(id);
        res.status(200).send({message: 'Curso eliminado de forma correcta', courses: result});
    }catch(err){
        res.status(500).send({message: 'error en la peticion para eliminar '});
        throw new Error('ocurrio un error al eliminar'); 
    }
} 

//------------------------------------Update-------------------------------------

const updateCourses = async(req, res) =>{
    try{
        let editCouse = req.body;
        const id = req.params.id;
        const courseModify = Courses.findById(id);
        if(!courseModify){
            res.status(400).send({msg: "Este curso no existe dentro dela db"});
        }else{
            const courseComplete = await Courses.findByIdAndUpdate(id, editCouse, {new: true});
            res.status(200).send({msg: 'El curso a sido actualizado de forma correcta', courseComplete});
        }
    }catch(err){
        (`Error al actualizar el curso` + error);
    }
}

//----------------------------------------------------------------------------------------------------------------

const cursoProfesor = async(req, res)=>{
    const {username, name} = req.params;
    try{
        let teacher = await Usuarios.findById(id);
        let course = await Courses.findById(id)

        if(!teacher){
            return res.status(404).send({mgs: 'El profesor no es existente'})
        }if(!course){
            return res.status(404).send({mgs: 'El curso no es existente'})            
        }else{
            const curso_Complete = await Courses.findByIdAndUpdate(id, username, name, {new: true});

            res.status(200).send({mgs: 'El curso a sido asignado de forma exitosa', curso_Complete})
        }
        course.teacher = teacher;
        await course.save();

        res.status(200).send(course);
    }catch(err){
        throw new Error('Error al actualizar el curso')
    }
}



module.exports =   {createCurses, listCourses, deleteCourses, updateCourses, cursoProfesor};
//Push => Añade elemento al array