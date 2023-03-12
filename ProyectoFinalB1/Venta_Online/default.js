'use strict'

const Usuarios = require("./src/models/userModel");
const bcrypt = require('bcrypt');
const { generateJWT } = require("./src/helpers/create-jwt");

//-------------------------------create-------------------------------------------

const defaultUser = async() => {
    try{
        const user = new Usuarios();
        user.name = 'David';
        user.lastname = 'Castro';
        user.email = 'jcastro-2021416@kinal.edu.gt';
        user.password = 'castro2004';
        user.rol = 'ADMIN';
        const userEncontrado = await Usuarios.findOne({email: user.email});
        if(userEncontrado) return console.log('El administrador se ha instalado de fomra correcta')
        //Encripcion de contraseña
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        user = await Usuarios.save();

        if(!user) return console.log('El admin no esta listo aun');
        return console.log('El admin ya esta listo')
    }catch(err){
        console.log(err);
    }
}

module.exports = {defaultUser}

