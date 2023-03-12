const {req, response} = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Usuarios = require('../models/userModel');

const validateJWT = async(req = request, res = response, next) =>{
    const token = req.header("x-token");
    //Si en cierto caso no viniera el token que realice lo siguuiente
    if(!token){
        return res.status(401).send({
            msg: 'No hay ningun token en su peticion',
        });
    }
    try{
        //decodificacion del token creado   
        const payload = jwt.decode(token, process.env.SECRET_KEY)
        const usuarioEncontrado = await Usuarios.findById(payload.uld);
        console.log(usuarioEncontrado);

        //Varificacion del token de expiracion
        if(payload.exp <= moment().unix()){
            return res.status(405).send({
                msg: 'Se paso de limite de tiempo, su token a expirado'
            });
        }
        // Si ya no existe 
        if(!usuarioEncontrado){
            return res.status(405).send({
                msg: 'Su usuario ya no existe dentro de la db'
            });
        }
        //Validacion si es ADMIN le de ciertos permmisos
        req.users = usuarioEncontrado;
        next();
    }catch(error){
        throw new Error(error);
    }
} 

module.exports = {validateJWT}