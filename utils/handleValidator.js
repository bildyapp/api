const { validationResult } = require("express-validator")

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw() // Valida lo que le hemos indicado
        return next() // Si no existe error con la validación se lo enviamos al siguiente (al controlador)
    } catch (err) {
        console.log(err)
        res.status(422) 
        res.send(err)
    }
}

module.exports = validateResults