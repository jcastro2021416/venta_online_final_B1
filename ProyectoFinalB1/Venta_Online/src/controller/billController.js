'use strict'

const Usuarios = require("../models/userModel");
const Product = require('../models/productModel');
const Bill = require('../models/bill');
const bill = require("../models/bill");


// --------------------------Añadir al carrito-----------------------
const addToCart = async(req, res) => {
    try{

        const {productId, quantity} = req.body;
        const userId = req.user.id;

         // Buscar el producto en la base de datos
    const product = await Product.findById(productId);

    // Si el producto no existe, enviar una respuesta de error
    if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si hay suficiente stock disponible para el producto
    if (product.stock < quantity) {
    return res.status(400).json({ message: 'Stock insuficiente' });
    }

    // Agregar el producto al carrito del usuario
    const user = await Usuarios.findByIdAndUpdate(
    userId,
    { $push: { carrito: { nombre: productId, cantidad: quantity } } },
    { new: true }
    ).populate('carrito.nombre');

    // Actualizar el stock del producto en la base de datos
    product.stock -= quantity;
    await product.save();

    // Enviar una respuesta exitosa con el usuario actualizado
    res.status(200).json(user);

} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
}
};

//---------------------Listar carrito-----------------------------------
const listCart = async(req, res) => {
    try{
        const user =  await Usuarios.findById(req.user._id).populate('carrito.nombre');
        res.status(200).json(user.carrito);
    }catch(err){
        res.status(500).json({msg: 'Error al obtener carrito'})
    }    
}

//--------------------------------Compras-------------------------------

const buy = async (req, res) =>{
    try{
        //Token del encabezado y decodificacion
        const userId = req.user.id;
        //buscar el usuario en la db
        const foundUser = await Usuarios.findById(userId);
        //Obtener producto del carrito del usuario
        const products = foundUser.carrito;

        //Calcula el total de la factura y la crea
        let total = 0;
        const billProducts = [];
        for (const product of products){
            const foundProduct = await Product.findById(product.nombre);
            const subtotal = foundProduct.price * product.cantidad;
        total += subtotal;
        billProducts.push({product: foundProduct, quantity: product.cantidad, subtotal});
        }
        const bill = new Bill({user: foundUser, product: billProducts, total});
        await bill.save();
        //Vaciar carrito de compras del usuario
        foundUser.carrito = [];
        await foundUser.save();
        res.status(200).json(bill);
    }catch(err){
        console.error(err);
        res.status(500).json({msg: 'Error al comprar los productos :('});
    }
}

//------------------------Mostrar compras por usuario-----------------
const listShop = async(req, res) =>{
    try{
        const userId = req.user.id;
        //Buscar facturas => Uususario
        const bills = await Bill.find({user: userId}).populate('products.product');

        //Devuelve facturas que encontro
        if(bills.length > 0){
            res.status(200).json(bills);
        }else{
            res.status(404).json({msg: 'No se encontro facturas'});
        }
    }catch(err){
        res.status(500).json('Error en el servidor')
    }
}

const BuyProduct = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const userId = req.body.userId;
            const user = await Usuarios.findById(userId);
            if(!user){
                return res.status(404).json(
                    {msg: 'Este usuario no exite'
                });
            }
            //Buscar facturas
            const bill = await Bill.find({user: userId}).populate({
                path: 'products.product', //Solo los valores que vamos a querer
                model: 'Products',
                select: 'name price',
            });
            return res.json({bill})
        }catch(err){
            throw new Error(err)
        }
    }else{
        return res.status(200).send({message: 'Eres ADMIN, por lo tanto no puede hacer esta solicitud'})
    }
}

module.exports= {addToCart, listCart, buy, listShop, BuyProduct}


