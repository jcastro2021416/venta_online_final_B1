/*Nos ayuda a generar nuestro token*/

const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_KEY;

const generateJWT = async(uId, username, email) =>{ 
    const payload = {uId, username, email};
    try{
        const token = await jwt.sign(payload, secret, {
            expiresIn: "45min",
    });
    return token;
    }catch(err){
        throw new Error('No se llego a generar su token' + err)
    }
}


module.exports = {generateJWT};
