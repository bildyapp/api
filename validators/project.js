const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")


const validatorProject = [
    check("name").exists().notEmpty(),
    check("projectCode").optional(),//.exists().notEmpty(),
    check("address").optional().isObject(),//.exists().notEmpty().isObject(),
    check("code").optional(),
    check("email").optional().isEmail(),
    check("clientId").exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorCompleteProject = [
    check("name").exists().notEmpty(),
    check("projectCode").exists().notEmpty(),
    check("code").optional(),
    check("email").optional().isEmail(),
    check("clientId").exists().notEmpty().isMongoId(),
    check("address").optional().isObject(),
    check("begin").optional(),
    check("end").optional(),
    check("notes").exists(),
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

const validatorGetItems = [
    check("clientId").exists().notEmpty().isMongoId(),
    check("id").exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorActivate = [
    check("active").exists().notEmpty().isBoolean(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]


module.exports = { validatorProject, validatorCompleteProject, validatorGetItem, validatorGetItems, validatorActivate }