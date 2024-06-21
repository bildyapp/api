const { clientModel, projectModel, deliveryNoteModel } = require('../models')
const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require('express-validator')
const { uploadToPinata, uploadToPinata2 } = require('../utils/handleUploadIPFS')
const path = require('path')

const getActiveProjects = async (clientId) => {
    try {
        const data = await projectModel.find({ clientId: clientId })
        let cont = 0
        data.forEach(proj => {
            if (proj.active) {
                cont++
            }
        })
        return cont
    } catch (err) {
        console.log(err)
    }
}

const getPendingDeliveryNotes = async (clientId) => {
    try {
        const data = await deliveryNoteModel.find({ clientId: clientId })
        let cont = 0
        data.forEach(dn => {
            if (dn.pending) {
                cont++
            }
        })
        return cont
    } catch (err) {
        console.log(err)
    }
}

const getClients = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await clientModel.find({ userId: userId }).sort({ updatedAt: -1 })
        const promises = data.map(async item => {
            const projects = await getActiveProjects(item._id)
            const deliverynotes = await getPendingDeliveryNotes(item._id)
            return { ...item, "projects": projects, "deliverynotes": deliverynotes }
        })
        const completeData = await Promise.all(promises)
        const resData = completeData.map(item => {
            return {
                ...item._doc,
                "activeProjects": item.projects,
                "pendingDeliveryNotes": item.deliverynotes
            }
        })

        res.send(resData)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, 'ERROR_GET_CLIENTS', 500)
    }
}


const getClient = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = matchedData(req)
        const data = await clientModel.findOne({ _id: id, userId: userId })
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_GET_CLIENT", 500)
    }
}

const createClient = async (req, res) => {
    try {
        userId = req.user._id
        req = matchedData(req)
        const body = { ...req, userId }
        //console.log(body)
        const data = await clientModel.create(body)
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_REGISTER_CLIENT")
    }
}

const updateClient = async (req, res) => {
    try {
        userId = req.user._id
        const { id, ...body } = matchedData(req)
        console.log(id, body)
        const data = await clientModel.findOneAndUpdate({ _id: id, userId: userId }, body)
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_UPDATE_CLIENT')
    }
}

//TODO
const updateImage = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const { file } = req
        const logo = process.env.PUBLIC_URL+file.filename
        const filePath = path.join(__dirname, `../storage/${file.filename}`)
        const ipfsFile = await uploadToPinata(filePath)
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        console.log("ipfs uri:", ipfs)
        const data = await clientModel.findOneAndUpdate({ _id: id, userId: userId }, {logo: ipfs})
        res.send(data)
    }catch(err) {
        console.log(err)
        handleHttpError(res, "ERROR_UPLOAD_IMAGE")
    }
}

const updateImage2 = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata2(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        const data = await clientModel.findOneAndUpdate({ _id: id, userId: userId }, {logo: ipfs})
        const dataRes = { ...data._doc, logo: ipfs} 
        res.send(dataRes)
    }catch(err) {
        //console.log(err)
        handleHttpError(res, "ERROR_UPLOAD_IMAGE")
    }
}

const deleteClient = async (req, res) => {
    try {
        userId = req.user._id
        const { id } = matchedData(req)
        //const data = await clientModel.deleteOne({ _id: id, userId: userId })
        const data = await clientModel.delete({ _id: id, userId: userId })
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, 'ERROR_DELETE_CLIENT')
    }
}

module.exports = { getClients, getClient, createClient, updateClient, updateImage, updateImage2, deleteClient };