'use strict'

const Usuarios = require('../models/userModel');
const Courses = require("../models/coursesModel");
const { generateJWT } = require('../helpers/create-jwt');
const bcrypt = require('bcrypt');

//---------------------------Create----------
const CreateUser = async(req, res) =>{
    const {username, email, password} = req.body;
    try{
        let usuario = await Usuarios.findOne({email: email});
        if(usuario){
            return res.status(400).send({
                message: 'El correo ingresado ya esta en uso',
                ok: false,
                usuario: usuario,
            })
        }
        usuario = new Usuarios(req.body);

        //Encriptacion de contraseña
        const saltos = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, saltos);
        //Guardar usuario
        usuario = await usuario.save();

        //Generacion de token
        const token = await generateJWT(usuario.id, usuario.username, usuario.email);
        console.log(token);

        //-------------------------------------------------------------------------------
        res.status(200).send({
            msg: `El estudiante ${username} creado correctamente`,
            usuario    ,
            token: token,
        });
    }catch(err){
        throw new Error(err);
        rest.status(500).json({
            ok: false,
            msg: `No se a encontrado el estudiante ${username}`,
            error: err,
        })   
    }
}

//-------------------------------------List---------------------------------

const listUser = async(req, res) =>{
    try{
        const user = await Usuarios.find();
        if(!user){
            res.status(400).send({
                message: 'No hay alumnos disponibles'})
        }else{
            res.status(200).send({alumnos_obtenidos: user})
        }
    }catch(err){ 
        throw new Error('Error al listar alumnos')
    }
}

//--------------------------------Delete-------------------------------------
const deleteUser = async(req, res) =>{
    try{
        const id = req.params.id;
        const result = await   Usuarios.findByIdAndDelete(id);
        res.status(200).send({
            msg: 'El alumno se a eliminado de forma correcta', user: result
        });
    }catch(err){
        throw(err);
    }
}

//-----------------------------Update----------------------------------

const UpdateUser = async(req, res) => {
    try{
        const id = req.params.id;
        let editUsuarios = {...req.body};
        //Encriptar contraseña
        editUsuarios.password = editUsuarios.password
        ? bcrypt.hashSync(editUsuarios.password, bcrypt.genSaltSync())
        : editUsuarios.password;
        const userComplete = await Usuarios.findByIdAndUpdate(id, editUsuarios, {
            new: true,
        });
        if(userComplete){
            const token = await generateJWT(userComplete.id, userComplete.username, userComplete.email);
            return res.status(200).send({mgs: "El usuario a sido actualizado de forma correcta", userComplete, token});
        }else{
            res.status(404).send({
                msg: "Este usuario no es existente dentro de la db"
            });
        }
    }catch(err){
        throw new Error('Error al actualizar los datos del alumno' + err);
    }
}


const AsignCourses = async(res, req)=>{ 
    try{
        const user = await Usuarios.findOne({username: req.body.username});
        const course = await Courses.findOne({name: req.body.name});
        if(!user){
            return res.status(404).json({error: 'No se a encontrado el usuario'})
        }
        if(!course){
            return res.status(404).json({error: 'No se a encontrado el curso'})
        }
        if(user.course.includes(course._id)){
            return res.status(400).json({error: 'El usuario ya ha sido asignado a este curso'})
        }
        if(user.course.lenght >= 3){
            return res.status(400).json({error: 'El usuario ya ha sido asignado a 3 cursos'})
        }
        user.course.push(course._id);
        await user.save();
        res.status(200).json(user);
        
    }catch(err){
        console.log(err)
        throw new Error('Error en la peticion para agregar el curso'  + err);
    }    
}


//-----------------------------------Login--------------------------------------
const loginUser = async(req, res)=>{
    const {email, password}=req.body; //Datos que vamos a comparar para ver si son correctos
    try{
        const user = await Usuarios.findOne({email});
        if(!user){
            return res.status(400).send({
                ok: false, 
                message: 'El usario no existe'}) }
        const validPassword = bcrypt.compareSync(password/*El que nostros enviamos*/, 
        user.password/*password registrado en la base de datos*/);
        if(!validPassword){
            return res.status(400).send({ok: false, message: 'constraseña incorrecta'})
        }
        const token = await generateJWT(user.id, user.username, user.email);
        res.json({
            ok: true,
            uid: user.id,
            name: user.username,
            email: user.email,
            token,
            
            msg: `Bienvenido ${user.username}`
        })
    }catch(err){
        throw new Error(err);
    }
}


module.exports =   {CreateUser, listUser, deleteUser, UpdateUser, AsignCourses, loginUser};



