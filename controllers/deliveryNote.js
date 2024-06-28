const { deliveryNoteModel, userModel, clientModel, projectModel } = require('../models')
const { handleHttpError } = require('../utils/handleError')
const { createPDF } = require('../utils/handlePDF')
const { matchedData } = require('express-validator')
const { uploadToPinata, uploadToPinata2 } = require('../utils/handleUploadIPFS')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const downloadImage = async (url, filepath) => {
    const response = await axios({
        url,
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('finish', () => resolve())
            .on('error', (e) => reject(e));
    });
}

const getDeliveryAllNotes = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await deliveryNoteModel.find({ userId: userId }).sort({ updatedAt: -1 }).populate('projectId')
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_GET_ALL_DELIVERYNOTES')
    }
}

const getDeliveryNotes = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = matchedData(req) //projectId
        const data = await deliveryNoteModel.find({ userId: userId, projectId: id }).sort({ updatedAt: -1 })
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, 'ERROR_GET_DELIVERYNOTES')
    }
}

const getDN = async (userId, id) => {
    try {
        const dataUser = await userModel.findById(userId)
        const dataNote = await deliveryNoteModel.findOne({ _id: id, userId: userId })
        const dataClient = await clientModel.findOne({ _id: dataNote.clientId, userId: userId })
        const dataProject = await projectModel.findOne({ _id: dataNote.projectId, userId: userId })
        const data = {
            "company": dataUser.company,
            "internalProjectCode": dataNote.internalProjectCode,
            "name": `${dataUser?.name ?? ""} ${dataUser?.surnames ?? ""}`,
            "date": dataNote.workdate,
            "client": {
                "name": dataClient.name,
                "address": dataClient.address,
                "cif": dataClient.cif
            },
            "project": dataProject.code,
            "description": dataNote.description,
            "format": dataNote.format,
            "hours": dataNote.hours,
            "material": dataNote.material,
            "quantity": dataNote.quantity,
            "unit": dataNote.unit,
            "sign": dataNote.sign,
            "observations": dataNote.observations,
            "name": dataNote.name
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

const getDeliveryNote = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = matchedData(req)
        const data = await getDN(userId, id)
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_GET_DELIVERYNOTE")
    }
}

const createDeliveryNote = async (req, res) => {
    try {
        userId = req.user._id
        req = matchedData(req)
        const body = { ...req, userId }
        const data = await deliveryNoteModel.create(body)
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_REGISTER_DELIVERYNOTE")
    }
}

const updateDeliveryNote = async (req, res) => {
    try {
        userId = req.user._id
        const { id, ...body } = matchedData(req)
        const data = await deliveryNoteModel.findOneAndUpdate({ _id: id, userId: userId }, body)
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, 'ERROR_UPDATE_DELIVERYNOTE')
    }
}

const closeDeliveryNote = async (req, res) => {

    try {
        const userId = req.user._id
        const { id, ...body } = matchedData(req)

        const filter = { _id: id, userId: userId }
        const update = {
            pending: !body.close
        }
        const doc = await deliveryNoteModel.updateOne(filter, update)
        res.send(doc)

    } catch (err) {
        handleHttpError(res, "ERROR_CLOSE_DELIVERYNOTE")
    }
}

const updateInternalCode = async (req, res) => {

    try {
        const userId = req.user._id
        const { id, ...body } = matchedData(req)
        const filter = { _id: id, userId: userId }
        const update = {
            internalProjectCode: body.code
        }
        const doc = await deliveryNoteModel.updateOne(filter, update)
        res.send(doc)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_CHANGING_INTERNAL_CODE")
    }
}

const updateSign = async (req, res) => {
    try {
        const userId = req.user._id
        const { id, ...body } = matchedData(req)

        const filter = { _id: id, userId: userId }
        const update = {
            sign: body.sign
        }
        const doc = await deliveryNoteModel.updateOne(filter, update)
        res.send(doc)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_CHANGING_SIGN")
    }
}

const updateObservations = async (req, res) => {
    try {
        const userId = req.user._id
        const { id, ...body } = matchedData(req)
        const filter = { _id: id, userId: userId }
        const doc = await deliveryNoteModel.updateOne(filter, body)
        res.send(doc)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_CHANGING_OBSERVATIONS")
    }
}

const updateSignImage = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const { file } = req
        const sign = process.env.PUBLIC_URL + file.filename
        const data = await deliveryNoteModel.findOneAndUpdate({ _id: id, userId: userId }, { sign: sign, pending: false })
        //const data = { userId, id, file, logo }
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_UPLOAD_SIGN_IMAGE")
    }
}

const updateSignImage2 = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata2(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        const data = await deliveryNoteModel.findOneAndUpdate({ _id: id, userId: userId }, { sign: ipfs, pending: false })
        const dataRes = { ...data._doc, sign: ipfs, pending: false }
        res.send(dataRes)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_UPLOAD_SIGN_IMAGE")
    }
}

const updatePDF = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = matchedData(req)
        const data = await getDN(userId, id)
        const pathPDF = await createPDF(data)
        const filter = { _id: id, userId: userId }
        const update = {
            pdf: pathPDF
        }
        const doc = await deliveryNoteModel.updateOne(filter, update)
        res.send(doc)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, "ERROR_UPDATE_PDF")
    }
}

const downloadPDF = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = matchedData(req)
        const dn = await getDN(userId, id)

        const data = {
            empresa: {
                nombre: dn?.company?.name ?? "",
                direccion: dn.company.street ? `${dn.company.street}, ${dn.company.number}` : "",
                ciudad: dn.company.city ? `${dn.company.city}, ${dn.company.postal}` : "",
                cif: dn?.company?.cif ?? ""
            },
            nombre: dn?.name ?? "",
            fecha: dn?.date ?? "",
            cliente: {
                nombre: dn?.client?.name ?? "",
                direccion: dn.client.address.street ?
                    `${dn.client.address.street}, ${dn.client.address.number}, ${dn.client.address.city}, ${dn.client.address.postal}` :
                    "",
                cif: dn.client.cif
            },
            formato: dn.format,
            codigoProyecto: dn?.project ?? "",
            descripcion: dn?.description ?? "",
            material: dn?.material ?? "",
            cantidad: dn.hours ? dn.hours : dn.quantity,
            unidades: dn.format == 'hours' ? 'horas' : dn.unit,
            observaciones: dn?.observations ?? "",
            nombre: dn?.name ?? ""
        };
        const constantColor = '#888888';
        // Descargar la imagen de la 
        const signatureUrl = dn.sign
        const signaturePath = path.resolve('./temp_signature.png');
        if (dn.sign && dn.sign != "") {
            await downloadImage(signatureUrl, signaturePath);
        }
        // Crear un nuevo documento PDF
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);
        doc.strokeColor(constantColor).rect(30, 80, doc.page.width - 60, doc.page.height - 160).stroke();
        if (dn.company.name) {
            // Información de la empresa
            doc.fillColor(constantColor).fontSize(12).text('EMPRESA', 50, 100, { indent: 20 });
            doc.strokeColor(constantColor).moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
            doc.moveDown(1);
            doc.fillColor('black').fontSize(10).text(
                `${data.empresa.nombre}\n${data.empresa.direccion}\n${data.empresa.ciudad}\nCIF: ${data.empresa.cif}`, { indent: 20 });
            doc.moveDown(1);
        } else {
            doc.y = 100
        }
        // Información del trabajador y fecha
        doc.fillColor(constantColor).fontSize(12).text('NOMBRE', 50, doc.y + 10, { indent: 20 });
        doc.fillColor(constantColor).fontSize(12).text('FECHA', 250, doc.y - 14, { indent: 20 });
        doc.strokeColor(constantColor).moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
        doc.moveDown(1);
        doc.fillColor('black').fontSize(10).text(`${data.nombre}`, 50, doc.y, { indent: 20 });
        const formattedDate = data.fecha.split('T')[0];
        doc.fillColor('black').text(`${formattedDate}`, 250, doc.y - 10, { indent: 20 });
        doc.moveDown();
        // Información del cliente
        doc.fillColor(constantColor).fontSize(12).text('CLIENTE', 50, doc.y + 10, { indent: 20 });
        doc.strokeColor(constantColor).moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
        doc.moveDown(1);
        doc.fillColor('black').fontSize(10).text(`${data.cliente.nombre}\n${data.cliente.direccion}\nCIF: ${data.cliente.cif}`, { indent: 20 });
        doc.moveDown();
        doc.text(`CODIGO PROYECTO: ${data.codigoProyecto}`, 50, doc.y + 10, { indent: 20 });
        doc.moveDown();
        // Información del trabajo realizado
        let descK = "DESCRIPCION"
        let descV = data.descripcion
        if (data.formato == "material") {
            descK = "MATERIAL"
            descV = data.material
        }
        doc.fillColor(constantColor).fontSize(12).text(descK, 50, doc.y + 10, { indent: 20 });
        doc.fillColor(constantColor).text('CANT', 260, doc.y - 14, { indent: 20 });
        doc.fillColor(constantColor).text('UDS', 350, doc.y - 14, { indent: 20 });
        doc.strokeColor(constantColor).moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
        doc.moveDown(1);

        if (data.formato == "material") {
            doc.fillColor('black').fontSize(10).text(`${descV}`, 50, doc.y, { indent: 20 });
            doc.text(`${data.cantidad}`, 260, doc.y - 11, { indent: 20 });
            doc.text(`${data.unidades}`, 350, doc.y - 13, { indent: 20 });
        }
        if (data.formato == "hours") {
            doc.text(`${data.cantidad}`, 260, doc.y, { indent: 20 });
            doc.text(`${data.unidades}`, 350, doc.y - 15, { indent: 20 });
            doc.fillColor('black').fontSize(10).text(`${descV}`, 50, doc.y + 5, { indent: 20 });
        }
        doc.moveDown();
        // Espacio para la firma
        doc.fillColor(constantColor).text('FIRMADO', 50, doc.y + 30, { indent: 20 });
        // Añadir la imagen de firma si existe
        if (dn.sign && dn.sign != "") {
            doc.image(signaturePath, 80, doc.y + 10, { width: 100 });
        }
        doc.moveDown();
        // Añadir campo "Nombre" debajo de la firma
        doc.fillColor('black').fontSize(10).text(`${data.nombre}`, 70, doc.y + 70, { indent: 20 });
        doc.moveDown();
        // Añadir campo "Observaciones" si existe
        if (dn.observations && dn.observations != "") {
            doc.fillColor(constantColor).text('OBSERVACIONES', 50, doc.y + 10, { indent: 20 });
            //doc.moveDown(1);
            doc.fillColor('black').fontSize(10).text(`${data.observaciones}`, 50, doc.y + 10, { indent: 20 });
        }
        // Añadir marca de agua
        const watermarkText = 'Bildy';
        doc.fontSize(48).opacity(0.3).fillColor('gray').text(watermarkText, {
            align: 'center',
            valign: 'center',
            rotate: 45
        });
        // Finalizar el documento
        doc.end();
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_PDF_DELIVERYNOTE')
    }
}

const deleteDeliveryNote = async (req, res) => {
    try {
        userId = req.user._id
        const { id } = matchedData(req)
        //const data = await deliveryNoteModel.deleteOne({ _id: id, userId: userId }) //borrado físico
        const data = await deliveryNoteModel.delete({ _id: id, userId: userId }) // borrado lógico: archiving
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, 'ERROR_DELETE_DELIVERYNOTE')
    }
}

module.exports = {
    getDeliveryNotes,
    getDeliveryAllNotes,
    getDeliveryNote,
    createDeliveryNote,
    closeDeliveryNote,
    updateDeliveryNote,
    updateInternalCode,
    updateSign,
    updateObservations,
    updatePDF,
    updateSignImage,
    updateSignImage2,
    deleteDeliveryNote,
    downloadPDF
};