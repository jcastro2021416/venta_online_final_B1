const {request, response} = require("express");
const jwt = require('jsonwebtoken');
const moment = require("moment");
const Empresas = require("../models/empresaModel");

const validateJWT = async(req = request, res = response, next)=>{
    const token = req.header("x-token"); //Los header envian el token
    //Si no viene el token
    if(!token){
        return res.status(400).send({
            msg: "No hay token en tu peticion",
        });
    }
    try{
    //Decodificacion de token
    const payload = jwt.decode(token, process.env.SECRET_KEY);
    const empresaEncontrada = await Empresas.findById(payload.uId);
    console.log(empresaEncontrada);
    //verificion expriacion de token
    if(payload.exp <= moment().unix()){
        return res.status(501).send({
            msg: "Su token a expirado"
        });
    }
    //Si el usuario sigue existiendo
    if(!empresaEncontrada){
        return res.status(400).send({
            msg: "El token no es valido ya que la empresa ya no existe fisicamente en db",
        });
    }
    req.empresa = empresaEncontrada;
    next();
    }catch(err){
        throw new Error(err);
    }
};

module.exports = {validateJWT}


