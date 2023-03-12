const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_KEY;

const generateJWT = async(uId, name_company, email) =>{
    const payload = {uId, name_company, email};
    try{
        const token = await jwt.sign(payload, secret,{
            expiresIn: '1h'    
        });
        return token;
    }catch(err){
        throw new Error(err + "Error al generar el token");
    }
};


module.exports = {generateJWT}




