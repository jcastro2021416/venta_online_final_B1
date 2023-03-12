const {request, response} = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Usuarios = require("../models/userModel");

const validateJWT = async(req = request, res = response, next) =>{
    const token = req.header("x-token");

    if(!token){ //Si no viene el token
        return res.status(401).send({
            message: "No hay token en la peticion",
        });
    }
        try{
            //Decodificacion de token
            const payload = jwt.decode(token, process.env.SECRET_KEY);
            //Usuario se buscara por medio del id
            const usuarioEncontrado = await Usuarios.findById(payload.uId);
            console.log(usuarioEncontrado);
            //Verificacion si el codigo no a expirado
            if(payload.exp <= moment().unix()){
                return res.status(405).send({
                    message: "El token a expirado" 
                });
                }
                if(!usuarioEncontrado){
                    return res.status(401).send({
                        message: "El usuario ya no existe dentro de la db"
                    });
                }
                //Creacion de nuevo atributo en el req => de lado controller si el rol tiene permisos(si es CLIENTE O ADMIN)
                req.user = usuarioEncontrado;

                next();
            
        }catch(err){
            throw new Error(err);
        }
    }

    module.exports = {validateJWT}
