const {validateResult} = require('express-validator');

const  validateParams = async(req, res, next) => {
    const errors = validateResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({
            ok: false,
            message: errors.mapped()
        })
    }
    next();
}

module.exports = {validateParams}






