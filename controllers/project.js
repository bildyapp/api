const { projectModel } = require('../models')
const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require('express-validator')

const getProjects = async (req, res) => {
    try {
        const userId = req.user._id
        const {id} = matchedData(req) //
        //console.log(userId, id)
        const data = await projectModel.find({userId: userId, clientId: id}).sort({ updatedAt: -1 })
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, 'ERROR_GET_PROJECTS')
    }
}

const getProject = async (req, res) => {
    try {
        const userId = req.user._id 
        const {clientId, id} = matchedData(req)
        const data = await projectModel.findOne({_id: id, userId: userId, clientId: clientId})
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_GET_PROJECT")
    }
}

const createProject = async (req, res) => {
    try {
        const userId = req.user._id
        //const req = matchedData(req)
        const body = { ...matchedData(req), userId }
        const data = await projectModel.create(body)
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_REGISTER_PROJECT")
    }
}

const updateProject = async (req, res) => {
    try {
        const userId = req.user._id
        const {id, ...body} = matchedData(req)
        const project = {...body, userId}
        const data = await projectModel.findOneAndUpdate({ _id: id, userId: userId }, project)
        res.send(data)    
    }catch(err){
        //console.log(err)
        handleHttpError(res, 'ERROR_UPDATE_PROJECT')
    }
}

const activateProject = async (req, res) => {
    try {
        const userId = req.user._id
        req = matchedData(req)
        const data = await projectModel.updateOne({ _id: req.id, userId: userId }, {active: req.active})
        res.send(data)    
    }catch(err){
        //console.log(err)
        handleHttpError(res, 'ERROR_ACTIVATE_PROJECT')
    }
}

const deleteProject = async (req, res) => {
    try {
        const userId = req.user._id
        const {id, clientId} = matchedData(req)
        //const data = await projectModel.deleteOne({_id:id, userId:userId, clientId:clientId})
        const data = await projectModel.delete({_id:id, userId:userId, clientId:clientId})
        res.send(data)    
    }catch(err){
        //console.log(err)
        handleHttpError(res, 'ERROR_DELETE_PROJECT')
    }
}

module.exports = { getProjects, getProject, createProject, updateProject, activateProject, deleteProject };