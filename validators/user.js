const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorRegister = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorInvite = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    check("company").optional().isObject(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorRegisterComplete = [
    check("email").exists().notEmpty().isEmail(),
    check("name").exists().notEmpty().isLength({ max: 100 }),
    check("surnames").exists().notEmpty().isLength({ max: 100 }),
    check("nif").exists().notEmpty().isLength({ min: 8, max: 9 }),
    check("birthday").optional().isLength({ max: 100 }),
    check("corporateEmail").optional().isEmail(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorAddr = [
    check("address").exists().notEmpty().isObject(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorRole = [
    check("role").exists().notEmpty().isLength({ min: 4, max: 8 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorCompany = [
    check("company").exists().notEmpty().isObject(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]


const validatorPass = [
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorEmailCode = [
    check("code").exists().notEmpty().isLength({ min: 6, max: 6 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorGoogle = [
    check("token").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorNotifications = [
    check("notifications").exists().notEmpty().isBoolean(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorEmail = [
    check("email").exists().notEmpty().isEmail(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorEmailRecover = [
    check("email").exists().notEmpty().isEmail(),
    check("code").exists().notEmpty().isLength({ min: 6, max: 6 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]


module.exports = { validatorEmail, validatorEmailRecover, validatorNotifications, validatorRegister, validatorInvite, validatorRegisterComplete, validatorLogin, validatorAddr, validatorRole, validatorCompany, validatorPass, validatorEmailCode, validatorGoogle }

