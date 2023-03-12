'use strict'

const Product = require('../models/productModel');
const Categorys = require('../models/categoryModel')
const bcrypt = require('bcrypt');
const {generateJWT} = require('../helpers/create-jwt')

//-----------------------------CRUD PRODUCT-------------------------------------
const createProduct = async(req, res)=>{
    if(req.user.rol === 'ADMIN'){
        const {name, description, price, stock, categoryName} = req.body; //Lo que aparecera en postan
        try{
            //Buscamos la categoria por el nombre = ID
            const category = await Categorys.findOne({name: categoryName});
            const categoryId = category ? 
            category._id : null;
            //Nuevo producto
            const newProduct = new Product({
                name,
                description,
                price,
                stock,
                category: categoryId,
            });
            //Agrega productos a la lista de productos, si se encuentra la categoria
            if(categoryId){
                await Categorys.findByIdAndUpdate(
                    categoryId,
                    {$push: {productos: newProduct._id}},
                    {new: true, userFindAndModify: false}
                )
            }
            //Guardamos el producto
            await newProduct.save();    
            return res.status(201).json({
                ok: true,
                msg: 'Producto creado de forma exitosa',
                product: newProduct,
            });
        }catch(err){
            return res.status(500).json({
                ok: false,
                msg: 'Error al crear el producto solicitado',
                error: err
            })
        }
    }else{
        res.status(401).send({msg: 'Eres cliente, por lo tanto no puedes agregar productos'})
    }
    
}

//--------------------------------read------------------------------
const listProducto = async(req, res)=>{
    if(req.user.rol === 'ADMIN'){
    try{
        const product = await Product.find();
        if(!product){
            res.status(401).send({
                msg: 'No hay productos disponibles'
            });
        }else{
            res.status(200).json({Productos_obtenidos: product})
        }
    }catch(err){
        throw new Error(err);
    }
    }else{
        return res
        .status(200)
        .send({
            message: 'Solo administrador puede listar los productos solicitados'
        });
    }
}

//-----------------------------------Buscar por nombre----------------------

const readProductByName = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
         //Se puede usar el params o body si llega a tirar error
        const {name} = req.body;
        try{
            const productos = await Product.findOne({name});

            if(!productos){
                res.status(400).send({message: 'No hay productos disponibles :('})
            }else{
                res.status(200).json({'Productos_obtenidos': productos})
            }
        }catch(error){
            console.log(error)
            res
            .status(500)
            .json({
                message: 'Error al buscar el producto solicitado'
            });
        }
    }else{
        return res
        .status(200)
        .send({
            message: 'Solo administrador puede listar los productos'
        });
    }
};

//-----------------------------delete-----------------------------

const deleteProduct = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const productId = req.params.id;    
            const deleteProduct = await Product.findByIdAndDelete(productId);
            if(!deleteProduct){
                return res
                .status(404)
                .json({
                    message: 'No existe este producto'
                });
            }

            const categoryId = deleteProduct.category;

            const category = await Categorys.findById(categoryId);

            if(!category){
                return res
                .status(404).json({
                    message: 'La categoria del producto no existe :(',
                });
            }

            category.productos.pull(productId);
            await category.save();

            res.json({message: 'Producto eliminado de forma exitosa :3'});

        }catch(error){
            console.log(error);
            res.status(500).json({message: 'Erro al eliminar el producto solicitado :('})
        }
    }else{
        return res.status(200).send({message: 'Solo administrador puede eliminar los productos solicitados'})
    }
};

//-------------------------------update----------------------------------

const updateProduct = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const {id} = req.params;
            const product = await Product.findByIdAndUpdate(id, req.body, {new: true});

            if(!product){
                return res.status(404).json({
                    message: 'El producto no existe'
                });
            }

            res.json(product);
        }catch(error){
            console.log(error)
            res.status(200).json({
                message: 'Error en el servidor'
            })
        }
    }else{
        return res.status(200).send({message: 'Solo administrador puede editar productos'})
    }
};

//-----------------------------Productos agotados-------------------------

const productSoldOut = async(req, res) => {
    if(req.user.rol === 'ADMIN'){
        try{
            //Buscar producto que el stok sea 0, que no haya disponible
            const product = await Product.find({stock: 0})

            //Si se encuentran productos mensaje que si se encontraron lo contrario estan Sold Out
            //.length busca entre todo el arreglo
            if(product.length > 0){ 
                return res.json({
                    ok: true,
                    message: 'Productos encontrados de forma existosa :D',
                    product: product,
                }) 
            }else{
                return res.json({
                    ok: false,
                    message: 'No hay productos agotados' 
                });
            } 

        }catch(error){
            return res
            .status(200)
            .json({
                message: 'Error al mostrar productos agotados :(',
            })
        }
    }else{
        return res.status(200).send({message: 'Solo admin puede realizar esta accion'})
    }
}



module.exports = {
    createProduct,
    listProducto,
    readProductByName,
    deleteProduct,
    productSoldOut,
    updateProduct
}





