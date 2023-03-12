/*
Nombre del ALumno: Juan David Castro Laynez
Carne: 2021416
Codigo Tecnico: IN6CV
Cuidador
*/

'use strict'

const Carer = require('../models/carer.model');

//---------------------------Crear---------------------------------

const createCarer = async(req, res) => {

    const {name, lastName, age, Numbercel, animalsInCharge} = req.body;
    try{ //findOne = Para encontrar la variable
        let carer = await Carer.findOne({Numbercel});

        if(carer){// Validar si el numero de telefono ya existe
            return res.status(400).send({
                ok: false, // no funcionara
                message: `Un usuario ya esta usando el telefono: ${Numbercel}`

            })
        }

        carer = new Carer(req.body);

        carer = await carer.save();

        res.status(200).send({
            message: `Usuario ${name} ${lastName}`, 
            ok: true, 
            cuidador: carer,
        });

    }catch(error){

        console.log(error);
        res.status(500).json({
            ok: false, 
            message: `No se ha creado el usuario: ${name} ${lastName}`,
            error: error,

        });
    }
};

//---------------------------Listar---------------------------------

const listCarer = async(req, res) =>{

    try{
        const carers = await Carer.find();

        if(!carers){
            res.status(400).send({message: 'No hay cuidadores disponibles'})
        }else{
            res.status(200).send({cuidadores_obtenidos: carers})
        }
    }catch(error){
        throw new Error ('error al listar datos')
    }
}

//-----------------------Eliminar------------------------------

const deleteCare = async (req, res) => {

    try{
        const id = req.params.id;
        const result = await Carer.findByIdAndDelete(id);
        res.status(200).send ({message: 'Usuario eliminado Correctamente', carer: result});
    }catch(error){
        res.status(500).send({message: 'error en la peticion '});
        throw new Error('ocurrio un error'); 
    }
}

//--------------------------------Actualizar------------------------

const updateCarer = async(req, res) =>{

    try{
        let editCarer = req.body;
        const id = req.params.id;
        const careModify = Carer.findById(id);
        if(!careModify){
            res.status(400).send({message: "Este cuidador no existe dentro de la base de datos"});
        }else {
            const carerComplete = await Carer.findByIdAndUpdate(id, editCarer,{new: true});
            res.status(200).send({message: 'cuidador actualizado correctamente', carerComplete});
        }
    }catch(error){
        throw new Error(`Error al actualizar el cuidador` + error);
    }
}



module.exports = {createCarer, listCarer, deleteCare, updateCarer}