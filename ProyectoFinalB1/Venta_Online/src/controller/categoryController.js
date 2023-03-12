'use strict'

const Categorys = require("../models/categoryModel");
const Product = require('../models/productModel')

//----------------------------------Create---------------------
const  createCategory = async(req, res)=>{
    if(req.user.rol === 'ADMIN'){
        const {name, description} = req.body;
        try{
            let category = await Categorys.findOne({name});
            if(category){
                return res.status(400).send({
                    msg: 'Esta categoria ya existe',
                    ok: false,
                    category: category,
                });
            }
            category = new Categorys({name, description});
            category = await category.save();

            res.status(200).send({
                msg: 'Categoria creada exitosamente',
                ok: true,
                category: category,
            });
        }catch(err){
            res.status(500).json({
                ok:false,
                msg: 'No se a creado la categoria',
                error: err,
            });
        }
    }else {
        return res.status(200).send({mgs: "Eres cliente, por lo tanto no puedes crear una categoria"})
    }
}

//------------------------------------------List----------------------------

const listCategory = async(req, res)=>{
    if(req.user.rol === 'ADMIN'){
        try{
            const categorys = await Categorys.find();

            if(!categorys){
                res.status(404).send({message: 'No hay categorias disponibles'});
        }else {
            res.status(200).json({'Categorias encontradas': categorys})
        }
        }catch(err){
            throw new Error(err);
        }
    }else{
        res.status(401).send({
            msg: 'Eres cliente, por lo tanto no puedes listar categorias'
        });
    }
}

//-------------------------------------Buscar por nombres----------------------------------
const readCategoryByName = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        //Se puede usar el params o body si da error
        const {name} = req.body; 
        try{
            const category = await Categorys.findOne({name});

            if(!category){
                res.status(400).send({message: 'Categoria inexistente'})
            }else{
                res.status(200).json({'Categorias_encontradas': category})
            }
        }catch(error){
            console.log(error)
            res
            .status(500)
            .json({
                message: 'Error al buscar Categoria'
            })
        }
    }else{
        return res
        .status(200)
        .send({
            message: 'Solo admin puede listar, ver estas Categorias'
        });
    }
};

//-------------------------------------------------Update-----------------------------------

const updateCategory = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const {id} = req.params;
            const category = await Categorys.findByIdAndUpdate(id, req.body, {new: true});

            if(!category){
                return res.status(404).json({
                    message: 'Esta categoria no es existe'
                });
            }

            res.json(category);
        }catch(error){
            console.log(error)
            res.status(200).json({
                message: 'Error en el servidor :('
            })
        }
    }else{
        return res.status(200).send({message: 'Solo administrador puede editar las Categorias'})
    }
};

//-------------------------------------delete--------------------------

const deleteCategory = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const categoryId = req.params.id;
            //Buscar la categoria por el  id y obtiene productos que contienen las categorias
            const category = await Categorys.findById(categoryId).populate('product');//Obtener los productos en dicha categoria populate
            const products = category.product;//El producto viene del modelo categoria linea 9
            //Si se llega a eliminar la categoria, se pasaran a una categoria por default los productos
            if(products.length > 0){
                //Buscar la categoria por default
                let defaultCategory = await Categorys.findOne({name: 'default'});
                //Si no existe la categoria, se va crear una por default
                if(!defaultCategory){
                    const newDefault = new Categorys({
                        name: 'default',
                        description: 'Estos productos no contienen categorias',
                        products: products.map((product) => product._id),
                    });

                    defaultCategory = await newDefault.save();
                }else{
                    defaultCategory.products.push(...products.map((product) => product._id));              
                    await defaultCategory.save(); 
                }
                
                const promises = products.map(async (product) =>{
                    product.category = defaultCategory._id;
                    await product.save();
                });

                await Promise.all(promises);
            }

            await Categorys.findByIdAndDelete(categoryId);
            res.json({message: 'La categoria se a eliminado de forma exitos'});
        }catch(error){
            console.log(error);
            res.status(500).send({
                message: 'Error al eliminar la categoria :('
            })
        }
    }else{
        return res.status(200).send({message: 'Solo administrador puede eliminar la  categoria'})
    }
};


module.exports = {createCategory, listCategory, readCategoryByName, updateCategory, deleteCategory};
