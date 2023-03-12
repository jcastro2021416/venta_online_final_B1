'use strict'

const Usuarios = require("../models/userModel");
const bcrypt = require('bcrypt');
const { generateJWT } = require("../helpers/create-jwt");

//-------------------------------create-------------------------------------------

const createUser = async(req, res)=>{
    const {name, email, password} = req.body;
    try{
        let usuario = await Usuarios.findOne({email});
        if(usuario){
            return res.status(400).send({
                msg: "Un usario ya se registro con el mismo correo",
                ok: false,
                usuario: usuario,
            });
        }
        usuario = new Usuarios(req.body);

        //Encripcion de controseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar contraseña
        usuario = await usuario.save();

        //Respues de que se genero de forma correcta        
        res.status(210).send({
            msg: `El usuario ${name} se creo de forma correcta`,
            ok: true,
            usuario: usuario,
        })
    }catch(err){
        console.log(err)
        res.status(510).send({
            ok: false,
            msg: `No se a podido crear el usuario: ${name}`,
            error: err,
        });
    }
}

//----------------------------------------listar--------------------------------------------
const listUser = async(req, res)=>{
    try{
        const user = await Usuarios.find();
        if(!user){
            res.status(410).send({
                mgs: 'No hay usuario disponibles dentro de la db'
            });
        }else{
            res.status(200).send({alumnos_obtenidos: user})
        }
    }catch(err){
        throw new Error('Error al listar usuarios')
    }
}

//------------------------------------Delete------------------------------------------------
const deleteUser = async(req, res) =>{
    try{
        const userId = req.user.id;
        const client = await Usuarios.findById(userId);
        if(!client){
            return res.status(404).json({msg: 'El cliente no se a encontrado'})
        }
        await client.remove();

        res.json({
            msg: "El cliente se elimino de forma correcta"
        })
    }catch(err){
        throw(err);
    }
}


//------------------------------------------update--------------------------------------------

const updateUser = async(req, res) => {
    if(req.user.rol === 'CLIENT'){
        try{
            const id = req.params.id;
            const userEdit = {...req.body};
            //Encriptar la contrasenia 
            userEdit.password = userEdit.password
            ? bcrypt.hashSync(userEdit.password, bcrypt.genSaltSync())
            : userEdit.password;

            if(id !== req.user.id){
                return res.status(401).send({message: 'No tienes permiso para editar este perfil'})
            }

            const userComplete = await Usuarios.findByIdAndUpdate(id, userEdit, {new: true,});

            if(userComplete){
                const token = await generateJWT(userComplete.id, userComplete.name, userComplete.email);
                return res.status(200).send({
                    message: 'Perfil actualizado correctamente', userComplete, token
                });
            }else {
                res.status(404).send({
                    message: 'Este usuario no existe en la base de datos'
                })
            }
        }catch(err){
            throw new Error(err);
        }
    }else{
        return res.status(200).send({message: 'Eres ADMIN, solo los clientes pueden editar perfil'})
    }
}

//------------------------------------Login------------------------------

const loginUser = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await Usuarios.findOne({email});
        if(!user){
            return res.status.send({
                ok:false,
                msg: "Primero debe de registrarse"
            });
        }
        const validPassword = bcrypt.compareSync(
            password,
            user.password
        )
        if(!validPassword){
            return res.status(400).send({
                ok: false,
                msg: "Password no es correcta"
            });
        }
        const token = await generateJWT(user.id, user.name, user.email);
        res.json({
            ok: true,
            uId: user.id,
            name: user.name,
            email: user.email,
            token,
            msg: `El usuario ${user.name} a ingresado de forma exitosa :D`
        })
    }catch(err){
        throw new Error(err)
    }
    
}

module.exports = {createUser, 
                listUser, 
                deleteUser, 
                updateUser,
                loginUser
            }





