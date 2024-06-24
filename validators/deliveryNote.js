const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorDeliveryNote = [
    check("clientId").exists().notEmpty().isMongoId(),
    check("projectId").exists().notEmpty().isMongoId(),
    check("description").exists(),
    check("format").exists().notEmpty(),
    check("material").optional(),
    check("quantity").optional(),
    check("unit").optional(),
    check("hours").optional(),
    check("workdate").optional(),
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

const validatorCode = [
    check("code").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorSign = [
    check("sign").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorObservations = [
    check("observations").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorClose = [
    check("close").exists().notEmpty().isBoolean(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]


module.exports = { validatorDeliveryNote, validatorGetItem, validatorCode, validatorSign, validatorObservations, validatorClose }