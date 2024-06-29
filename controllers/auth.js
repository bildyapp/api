const { matchedData } = require("express-validator")
const { tokenSign } = require("../utils/handleToken")
const { encrypt, compare } = require("../utils/handlePassword")
const { handleHttpError } = require("../utils/handleError")
const { verify } = require("../utils/handleVerifyGoogle")
const { generateVerificationCode, sendEmail } = require("../utils/handleMails")
const { userModel } = require("../models")


const registerGoogle = async (req, res) => {
    try {
        const { token } = matchedData(req)
        const dataUser = await verify(token)
        const filter = { email: dataUser.email }
        const user = await userModel.findOne(filter).select("email status role")
        let dataRes
        if (!user) {
            dataRes = await userModel.create({...dataUser, status:1})
        } else {
            dataRes = user
        }
        const data = {
            token: tokenSign(dataRes),
            user: dataRes
        }
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_REGISTER_GOOGLE")
    }
}

const registerCtrl = async (req, res) => {
    try {
        
        req = matchedData(req)
        const password = await encrypt(req.password)
        const emailCode = generateVerificationCode();
        const filter = { email: new RegExp(`^${req.email}$`, 'i') }
        const user = await userModel.findOne(filter).select("email status")

        if (user && user.status == 1) {
            handleHttpError(res, "USER_EXISTS", 409)
            return
        }

        sendEmail({
            subject: "Tu código de verificiación de Bildy",
            text: `Tu código de verificación es: ${emailCode}`,
            from: `"No Reply" <${process.env.EMAIL}>`,
            to: req.email,
            from: process.env.EMAIL
          });

        const body = { ...req, password, emailCode }
        let dataUser
        if (!user) {
            dataUser = await userModel.create(body)
            dataUser.set('password', undefined, { strict: false })
            dataUser.set('emailCode', undefined, { strict: false })
        } else {
            await userModel.updateOne(filter, body)
            user.emailCode = emailCode
            dataUser = user
        }
        
        const data = {
            token: tokenSign(dataUser),
            user: dataUser
        }
      
        res.send(data)
      
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_REGISTER_USER")
    }
}

const inviteCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const password = await encrypt(req.password)
        const role = "guest";

        const body = { ...req, password, role }
    
        const user = await userModel.findOne({ email: new RegExp(`^${req.email}$`, 'i') }).select("email")
        if (user) {
            handleHttpError(res, "USER_EXISTS", 409)
            return
        }

        const dataUser = await userModel.create(body)
        dataUser.set('password', undefined, { strict: false })

        const data = {
            //token: tokenSign(dataUser),
            user: dataUser
        }

        sendEmail({
            subject: "Tu invitación a Bildy",
            text: "Descárgalo en: TODO",
            from: `"No Reply" <${process.env.EMAIL}>`,
            to: req.email,
            from: process.env.EMAIL
          });

        res.send(data)
      
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_REGISTER_GUEST")
    }
}

const registerCompleteCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const filter = { email: req.email }
        const update = {
            name: req.name,
            surnames: req.surnames,
            nif: req.nif,
            birthday: req.birthday,
            corporateEmail: req.corporateEmail,
        }
        const doc = await userModel.findOneAndUpdate(filter, update, { new: true })
        res.send(doc)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_REGISTER_COMPLETE_USER")
    }
}

const loginCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        //const user = await usersModel.findOne({ email: req.email }).select("password name role email")
        const user = await userModel.findOne({ email: new RegExp(`^${req.email}$`, 'i') }).select("password name role email status")
        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }

        if (user.status == 0) {
            handleHttpError(res, "USER_NOT_VALIDATED", 401)
            return
        }  

        const hashPassword = user.password;
        const check = await compare(req.password, hashPassword)

        if (!check) {
            handleHttpError(res, "INVALID_PASSWORD", 401)
            return
        }

        user.set('password', undefined, { strict: false })

        const data = {
            token: tokenSign(user),
            user
        }

        res.send(data)

    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_LOGIN_USER")
    }
}

const validateEmail = async (req, res) => {
    try {
        userId = req.user._id
        const { code } = matchedData(req)
        const data = await userModel.findById(userId)
        if (data.emailCode == code && data.attempt < 10) {
            const filter = { _id: userId }
            const update = { status: 1 }
            const doc = await userModel.updateOne(filter, update)
            res.send(doc)
        } else {
            const counter = data.attempt + 1
            await userModel.updateOne({_id: userId}, {attempt: counter})
            handleHttpError(res, "ERROR_MAIL_CODE")          
        }
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_VALIDATE_USER_EMAIL")
    }
}

const validateEmailRecover = async (req, res) => {
    try {
        req = matchedData(req)
        const user = await userModel.findOne({email: req.email}).select("email role status emailCode attempt")
        if (user.emailCode == req.code && user.attempt < 10) {
            const data = {
                token: tokenSign(user),
                user: user
            }
            if (user.attempt > 0) {
                await userModel.updateOne({email: req.email}, {attempt: 0})
            }
            res.send(data)
        } else {
            const counter = user.attempt + 1
            await userModel.updateOne({email: req.email}, {attempt: counter})
            handleHttpError(res, "ERROR_MAIL_CODE")
        }
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_VALIDATE_USER_EMAIL_RECOVER")
    }
}

const recoverPass = async (req, res) => {
    try {
        req = matchedData(req)
        const emailCode = generateVerificationCode();
        //const filter = { email: new RegExp(`^${req.email}$`, 'i') }
        filter = { email: req.email }
        const user = await userModel.findOne(filter).select("email role status")

        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }

        if (user.status == 0) {
            handleHttpError(res, "USER_NOT_VALIDATED", 409)
            return
        }

        sendEmail({
            subject: "Tu código de recuperación de Bildy",
            text: `Tu código de recuperación es: ${emailCode}`,
            from: `"No Reply" <${process.env.EMAIL}>`,
            to: req.email,
            from: process.env.EMAIL
          });

        
        await userModel.updateOne(filter, {emailCode: emailCode})
        
        const data = {
            user: user
        } 
        res.send(data)
    }catch (err) {
        handleHttpError(res, "ERROR_RECOVER_PASSWORD")
    }
}

module.exports = { registerGoogle, registerCtrl, inviteCtrl, registerCompleteCtrl, loginCtrl, validateEmail, validateEmailRecover, recoverPass }