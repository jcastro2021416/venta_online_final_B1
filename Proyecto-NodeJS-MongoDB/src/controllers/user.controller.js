/*
Nombre del ALumno: Juan David Castro Laynez
Carne: 2021416
Codigo Tecnico: IN6CV
User
*/

'use strict'

const User = require('../models/user.model'); /*Creacion de constante User con mayuscula ya que hace referecia al modelo y que 
no nos lleguemos a confundir*/
const bcrypt = require("bcrypt"); /*Para encriptar contraseña*/
const { user } = require('../routes/user.routes');
const { generateJWT } = require('../helpers/create-jwt');

//----------------------------Crear-------------------------
const createUser = async (req, res) => {
    if (req.user.rol === "ADMIN") {
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email: email });
        if (user) {
          return res.status(400).send({
            message: "Un usuario ya existe con este correo",
            ok: false,
            user: user,
          });
        }
        user = new User(req.body);
  
        //Encriptar la contraseña
        const saltos = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, saltos);
  
        //Guardar Usuarios
        user = await user.save();
  
        //generar token
        const token = await generateJWT(user.id, user.username, user.email);
        res.status(200).send({
          message: `Usuario ${user.username} creado correctamente`,
          user,
          token: token,
        });
      } catch (err) {
        throw new Error(err);
      }
    } else {
      return res.status(500).send({
        message: "Este usuario no tiene permiso para crear mas usuarios",
      });
    }
  };
    

//-----------------------------------Listar------------------------

const listUsers = async (req, res) =>{
    try {
        const users = await User.find();

        if(!users){ //Si los usuario estan vacios
            /*Es opcional colocar return ya que con el `res` nostros ya le estamos respondiendo y funciona como un return*/
            res.status(400).send({message: "No hay usuarios disponibles"});
        } else{
            res.status(200).send({usuarios: users});
        }

    } catch (err) {
        throw new Error('error al listar usuarios');
    }
};

// ---------------------------------------Actualizar-------------------

const updateUser = async(req, res)=>{
    try{
        const id = req.params.id;
        const userEdit = {...req.body}
        //Encripctacion de contraseña
        /*Si el userEdit.password viene lleno o sea si la contraseña se esta modificando que la encripte
        y si no pues que la contraseña se quede asi */
        userEdit.password = userEdit.password
        ? bcrypt.hashSync(userEdit.password, bcrypt.genSaltSync())
        : userEdit.password;
        const userComplete = await User.findByIdAndUpdate(id, userEdit, {new: true,});
        /*Este sirve para que cuando nos regrese la peticion sea el nuevo registro ya modificado*/
        if(userComplete){
            const token = await generateJWT(userComplete.id, userComplete.username, userComplete.email);
            return res.status(200).send({message: `Ususario actualizado correctamente`, userComplete, token});
        }else{
            res.status(404).send({message: 'Este usuario no existe en la base de datos, verificar parametros'})
        }
    }catch(err){
        throw new Error(err);   
    }
    }

//----------------------------------Eliminar------------------------------------------------------

const deleteUser = async (req, res) => {
    if (req.user.rol === "ADMIN") {
      try {
        const id = req.params.id;
        const userDelete = await User.findByIdAndDelete(id);
        return res
          .status(200)
          .send({ message: "usuario eliminado correctamente", userDelete });
      } catch (err) {
        throw new Error(err);
      }
    } else {
      return res
        .status(500)
        .send({ message: "este usuario no tiene permisos de ADMIN" });
    }
  };

//===================================Token-----------------------------------------------------------------

const loginUser = async(req, res)=>{
    const {email, password}=req.body; //Datos que vamos a comparar para ver si son correctos
    try{
        const user = await User.find({email: email});
        if(!user){
            return res.status(400).send({
                ok: false, 
                message: 'El usario no existe'}) }
        const validPassword = bcrypt.compareSync(password/*El que nostros enviamos*/, 
        user.password/*password registrado en la base de datos*/);
        if(!validPassword){
            return res.status(400).send({ok: false, message: 'constraseña incorrecta'})
        }
        const token = await generateJWT(user.id, user.username, user, email);
        res.json({
            ok: true,
            uid: user.id,
            name: user.username,
            email: user.email,
            token: token,
        })
    }catch(err){
        res.status(500).json({
            ok: false,
            msg:'Porfavor hable con el administrador, usuario no registrado',
        });
    }
}

/*Exportacion de funciones*/
module.exports = {createUser,
    listUsers, 
    updateUser, 
    deleteUser, 
    loginUser};
