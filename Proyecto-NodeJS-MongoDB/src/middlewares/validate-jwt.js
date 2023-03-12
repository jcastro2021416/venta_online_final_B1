/*Nos va a servir para mandar el token que esta guardado en el fronted e ir a comparlo al backend para ver si son los mismos datos*/
const {request, response} = require("express");
const jwt = require("jsonwebtoken")
const moment = require("moment");
const User = require('../models/user.model');


/*Nos va ayudar a validar el token que se crea, para usarlo, si sigue validado, si ya expiro*/ 
const validateJWT = async(req = request, res = response, next) =>{ //Es un middlewares 
    const token = req.header("x-token");
    //Si no viene el token
    if(!token){
        return res.status(401).send({
            message: "No hay token en la peticion",
        });
    }
    try{
        //Decodifica el token
        const payload = jwt.decode(token, process.env.SECRET_KEY);
        /*payload => Son los datos enciptados del usuario*/
        //Usuario se va a buscar por medio del id que guarda el token
        const user = await User.findById(payload.uId); //user va a buscar un usuario dentro de la db y nos devuelve un modelo igual que en la db
        console.log(payload);
        /*Verifica si el token ya paso el timpo de expiracion*/ 
        if(payload.exp <= moment().unix()){ 
            return res.status(500).send({message: "el token ha expirado"});
        }
        //Verifica si el usuario o el dueño del token sigue existiendo en la db
        if(!user){
            return res.status(401).send({
                message: "Token no valido - user no existe en DB fisicamente",
            });
        }
        //Creo un nuevo atributo en el request y se usa del lado del controller para validar si el rol tiene permisos(=== ADMIN) 
        req.user = user; //Asigna un parametro al req, que es igual al usuario que encontro a la bd
        next();
    }catch(err){
        throw new Error(err);
    }
};

module.exports = {validateJWT};``






