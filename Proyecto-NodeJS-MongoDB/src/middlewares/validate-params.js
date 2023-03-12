const {validationResult} = require('express-validator');

const validateParams = async(req, res, next)=>{ //Carpturacion de errores que vienen de la ruta
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({
            ok: false,
            errors: errors.mapped()
        })
    }
    next();
} 

module.exports = {validateParams};

