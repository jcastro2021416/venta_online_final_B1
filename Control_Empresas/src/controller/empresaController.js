'use strict'

const Empresa = require("../models/empresaModel");
const bcrypt = require('bcrypt');
const {generateJWT} = require("../helpers/create-jwt")

const createEmpresa = async(req, res) => {
    const{email, password} = req.body;
    try{
        let empresa = await Empresa.findOne({email});
        if(empresa){
            return res.status(401).send({
                mgs: "Una empresa ya esta registrado con este correo dentro de la db",
                ok: false,
                empresa: empresa,
            });
        }
        empresa = new Empresa(req.body);

        //Encriptacion de contraseña
        const salt = bcrypt.genSaltSync();
        empresa.password = bcrypt.hashSync(password, salt);

        //Guardamos la empresa
        empresa = await empresa.save();

        //Generacion de token
        const token = await generateJWT(empresa.id, empresa.name_company, empresa.email);
        res.status(201).send({
            msg: `Empresa ${empresa.name_company} creada de forma exitosa`,
            empresa,
            token: token
        })
    }catch(err){
        throw new Error(err);
    }
}

//------------------------------Read-------------------------------
const readEmpresa = async(req,res)=>{
    try{
        const empresas = await Empresa.find();
        if(!empresas){
            res.status(401).send({
                msg: 'No hay empresas disponibles dentro de la db'
            });
        }else{
            res.status(201).send({empresas_disponibles: empresas})
        }
    }catch(err){
        throw new Error(err)
    }
}

//---------------------------delete------------------------------
const deleteEmpresa = async(req, res)=>{
    try{
        const id = req.params.id;
        const result = await Empresa.findByIdAndDelete(id);
        res.status(201).send({
            msg: `La siguiente empresa se elimino de forma correcta`, empresa: result
        });
    }catch(err){
        throw new Error(err)
    }
}

//------------------------------update---------------------------------

const updateCompany = async(req, res) =>{
    try{
        const id = req.params.id;
        let editCompany = {...req.body};
        //Encriptacion de contraseña
        editCompany.password = editCompany.password
        ? bcrypt.hashSync(editCompany.password, bcrypt.genSaltSync())
        : editCompany.password;
        const companyComplete = await Empresa.findByIdAndUpdate(id, editCompany, {
            new: true,
        });
        if(companyComplete){
            const token= await generateJWT(companyComplete.id, companyComplete.name_company, companyComplete.email)
            return res.status(200).send({
                msg: `La empresa se a actualizado de forma correcta`, companyComplete, token
            });
        }else{
            res.status(401).send({
                msg: "La empresa no existe dentro de la db"
            });
        }
    }catch(err){
        throw new Error(`Error al actualizar los datos de la empresa` + err);
    }
}

//-------------------------------------Login--------------------------------------------------

const loginCompany = async(req, res) =>{
    const {email, password} = req.body;
    try{
        const empresa = await Empresa.findOne({email});
        if(!empresa){
            return res.status(400)
            .send({
                msg: "Esta empresa no existe",
            });
        }
        const validPassword = bcrypt.compareSync(password, empresa.password);
        if(!validPassword){
            return res.status(400).send({
                ok: false,
                msg: "Password incorrecta - verificar password",
            });
        }
        const token = await generateJWT(empresa.id, empresa.name_company, empresa.email);
        res.json({
            ok: true,
            uid: empresa.id,
            name: empresa.name_company,
            email: empresa.email,
            token,
            msg: `Bienvenido :3 ${empresa.name_company}`,
        });
    }catch(err){
        throw new Error(err)
    }
};

//---------------------------------- CRUD SUCURSALES------------------------------------------

const addEmpresas = async(req, res) =>{
    try{
        const id = req.params.id;
        const {detailed_location, municipality} = req.body;
        const empresaSucursal = await Empresa.findByIdAndUpdate(
            id, 
            {
                $push:{
                    branch_offices: {
                        detailed_location: detailed_location,
                        municipality: municipality,
                    },
                },
            },
            {new: true}
            );
            if(!empresaSucursal){
                return res.status(401).send({
                    msg: "La sucursal no se a encontrado dentro de la base de datos :("
                });
            }
            return res.status(201).send({empresaSucursal});
    }catch(err){
        throw new Error(err);
    }
}

//--------------------------------delete----------------------------

const deleteSucursal = async (req, res)=>{
    const id = req.params.id;
    const {idSucursal} = req.body;
    try{
        const eraseSucursal = await Empresa.updateOne(
            {_id:id},
            {
                $pull: {branch_offices: { _id: idSucursal }},
            },
            {
                new: true, multi: false
            }
        );  
        if(!eraseSucursal){
            return res.status(405).send({
                msg: "No existe esta sucursal :/"
            });
        }
        return res.status(200).send({
            eraseSucursal
        });
    }catch(err){
        throw new Error(err);
    }
};

//-------------------------------------update---------------------------------------
const updateSucursal = async(req, res) =>{
    const id = req.params.id;
    const {idSucursal, detailed_location, municipality} = req.body;
    try{
        const editSucursal = await Empresa.updateOne(
            { _id: id, "branch_offices._id" : idSucursal},
            {
                $set:{
                    "branch_offices.$.detailed_location": detailed_location,
                    "branch_offices.$.municipality" : municipality,
                },
            },
            {new: true}
        );
        if(!editSucursal){
            return res.status(404).send({msg: "No existe esta sucursal dentro de la db :/"});
        }
        return res.status(200).send({
            editSucursal, msg: "Sucursal agregada de forma correcta :D"
        })
    }catch(err){
        throw new Error(err);
    }
}

//--------------------------------------------------------------------------------------------

module.exports = {
        createEmpresa,
        readEmpresa,
        deleteEmpresa,
        updateCompany,
        loginCompany,
        addEmpresas,
        deleteSucursal,
        updateSucursal
    };



