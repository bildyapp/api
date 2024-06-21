const { userModel } = require("../models")
const { handleHttpError } = require("../utils/handleError")
const { verifyToken } = require("../utils/handleToken")

const authMiddleware = async (req, res, next) => {
    try{
        if (!req.headers.authorization) {
            handleHttpError(res, "NOT_TOKEN", 401)
            return
        }
// Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
        const token = req.headers.authorization.split(' ').pop()
//Del token, miramos en Payload (revisar verifyToken de utils/handleToken)
        const dataToken = verifyToken(token)
        if(!dataToken._id) {
            handleHttpError(res, "ERROR_ID_TOKEN", 401)
            return
        }
        const user = await userModel.findById(dataToken._id)
   
        if(!req.body.code && user.status == 0) {
            handleHttpError(res, "USER_NOT_VALIDATED", 401)
            return
        }
        
        req.user = user
        next()
    }catch(err){
        handleHttpError(res, "NOT_SESSION", 401)
    }
}

module.exports = authMiddleware
