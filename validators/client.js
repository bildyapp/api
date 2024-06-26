const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorClient = [
    check("name").exists().notEmpty(),
    check("cif").optional().isLength({ min: 8, max: 9 }),
    check("address").optional().isObject(),
    check("logo").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorCompleteClient = [
    check("name").exists().notEmpty(),
    check("cif").optional().isLength({ min: 8, max: 9 }),
    check("address").optional().isObject(),
    check("logo").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorGetItem = [
    check("id").exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = { validatorClient, validatorCompleteClient, validatorGetItem }