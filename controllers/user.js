//TODO https://docs.google.com/presentation/d/1Tib_AejKBZMaUISrVjnTIMPvkhEsMkVxLMER8aiEdqs/edit#slide=id.g2122482d99a_0_0

const { userModel } = require("../models")
const { handleHttpError } = require("../utils/handleError")
const { matchedData } = require('express-validator')
const { encrypt } = require("../utils/handlePassword")
const { uploadToPinata2 } = require('../utils/handleUploadIPFS')

const getUser = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await userModel.findById(userId)
        res.send(data)
    } catch (err) {
        handleHttpError(res, "ERROR_GETTING_USER")
    }
}

const updateAddr = async (req, res) => {
    try {
        const id = req.user._id
        req = matchedData(req)
        const filter = { _id: id }
        const update = {
            address: req.address
        }
        const doc = await userModel.updateOne(filter, update)
        res.send(doc)
   
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_ADDING_USER_ADDR")
    }
}

const updateRole = async (req, res) => {
    try {
        const id = req.user._id
        req = matchedData(req)
        const filter = { _id: id }

        if (req.role != "user") 
            return

        const update = {
            role: req.role
        }
        const doc = await userModel.updateOne(filter, update)
        res.send(doc)
   
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_CHANGING_USER_ROLE")
    }
}

const updateCompany = async (req, res) => {
    try {
        const id = req.user._id
        req = matchedData(req)
     
        const filter = { _id: id }
        const update = {
            company: req.company
        }
        const doc = await userModel.updateOne(filter, update)
        res.send(doc)
   
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_ADDING_USER_COMPANY")
    }
}

const updateNotifications = async (req, res) => {
    try {
        const id = req.user._id
        req = matchedData(req)
     
        const filter = { _id: id }
        const update = {
            notifications: req.notifications
        }
        const doc = await userModel.updateOne(filter, update)
        res.send(doc)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_UPDATING_NOTIFICATIONS")
    }
}

const updatePass = async (req, res) => {
    try {
        const id = req.user._id
        req = matchedData(req)
        const pass = await encrypt(req.password)
    
        const filter = { _id: id }
        const update = {
            password: pass
        }
        const doc = await userModel.updateOne(filter, update)
        res.send(doc)
   
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_CHANGING_PASSWD_USER")
    }
}

const deleteUser = async (req, res) => { 
    try {
        const userId = req.user._id
        console.log(userId)
        //const data = await userModel.deleteOne({_id:userId})
        const data = await userModel.delete({_id:userId})
        res.send(data)    
    }catch(err){
        //console.log(err)
        handleHttpError(res, 'ERROR_DELETE_USER')
    } 
}

const updateImage = async (req, res) => {
    try {
        const userId = req.user._id
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata2(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        const data = await userModel.findOneAndUpdate({_id: userId }, {logo: ipfs})
        const dataRes = { ...data._doc, logo: ipfs} 
        res.send(dataRes)
    }catch(err) {
        console.log(err)
        handleHttpError(res, "ERROR_UPLOAD_COMPANY_IMAGE")
    }
}


module.exports = { getUser, updateAddr, updateRole, updateCompany, updatePass, updateNotifications, updateImage, deleteUser };
