const PDFDocument = require('pdfkit');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Función para descargar la imagen

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

const createPDF = async (dn) => {
    const alb = Date.now()+"-albaran.pdf"
    const outputPDF = `./${alb}`
    const data = {
        empresa: {
            nombre: dn.company.name,
            direccion: `${dn.company.street}, ${dn.company.number}, ${dn.company.city}, ${dn.company.postal}`,
            cif: dn.company.cif
        },
        nombre: dn.name,
        fecha: dn.date.toLocaleDateString('es-ES'),
        cliente: {
            nombre: dn.client.name,
            direccion: `${dn.client.address.street}, ${dn.client.address.number}, ${dn.client.address.city}, ${dn.client.address.postal}`,
            cif: dn.client.cif
        },
        codigoProyecto: dn.project,
        descripcion: dn.description,
        cantidad: dn.hours,
        unidades: dn.format,
        observaciones: dn.observations
    };

    const constantColor = '#888888';

    // Descargar la imagen de la firma
    const signaturePath = path.resolve(__dirname, '../storage/temp_signature.png');
    const signatureUrl = dn.sign
    //const signaturePath = 'storage/firma.png';
    await downloadImage(signatureUrl, signaturePath);

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({ margin: 30 });

    // Guardar el PDF en un archivo
    doc.pipe(fs.createWriteStream(outputPDF));

    // Estilos y contenido del PDF
    /*
    doc.fontSize(18).text('Borrador albarán', { align: 'center', underline: true });
    doc.moveDown();
    */
    // Dibujar recuadro
    //doc.page.width - 120
    doc.strokeColor(constantColor).rect(30, 80, doc.page.width - 60, doc.page.height - 160).stroke();

    // Información de la empresa
    doc.fillColor(constantColor).fontSize(12).text('EMPRESA', 50, 100, { indent: 20 });
    doc.strokeColor(constantColor).moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown(1);
    doc.fillColor('black').fontSize(10).text(`${data.empresa.nombre}\n${data.empresa.direccion}\nCIF: ${data.empresa.cif}`, { indent: 20 });
    doc.moveDown();

    // Información del trabajador y fecha
    doc.fillColor(constantColor).text('NOMBRE', 50, doc.y + 10, { indent: 20 });
    doc.fillColor(constantColor).text('FECHA', 250, doc.y - 10, { indent: 20 });
    doc.strokeColor(constantColor).moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown(1);
    doc.fillColor('black').fontSize(10).text(`${data.nombre}`, 50, doc.y, { indent: 20 });
    doc.fillColor('black').text(`${data.fecha}`, 250, doc.y - 10, { indent: 20 });
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
    doc.fillColor(constantColor).fontSize(12).text('DESCRIPCION', 50, doc.y + 10, { indent: 20 });
    doc.fillColor(constantColor).text('CANT', 250, doc.y - 10, { indent: 10 });
    doc.fillColor(constantColor).text('UDS', 350, doc.y - 10, { indent: 20 });
    doc.strokeColor(constantColor).moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown(1);
    doc.fillColor('black').fontSize(10).text(`${data.descripcion}`, 50, doc.y, { indent: 20 });
    doc.text(`${data.cantidad}`, 250, doc.y - 10, { indent: 20 });
    doc.text(`${data.unidades}`, 350, doc.y - 10, { indent: 20 });
    doc.moveDown();

    // Espacio para la firma
    doc.fillColor(constantColor).text('FIRMADO', 50, doc.y + 30, { indent: 20 });
    // Añadir la imagen de firma
    doc.image(signaturePath, 80, doc.y + 20, { width: 100 });

     // Añadir campo "Observaciones" si existe
    if (data.observaciones) {
        doc.fillColor(constantColor).fontSize(12).text('OBSERVACIONES', 80, doc.y + 20, { indent: 20 });
        doc.strokeColor(constantColor).moveTo(80, doc.y + 5).lineTo(recuadroAncho + 60, doc.y + 5).stroke();
        doc.moveDown(1);
        doc.fillColor('black').fontSize(10).text(`${data.observaciones}`, 80, doc.y + 10, { indent: 20 });
    }

    // Añadir marca de agua
    const watermarkText = 'BORRADOR';
    doc.fontSize(48).opacity(0.3).fillColor('gray').text(watermarkText, {
        align: 'center',
        valign: 'center',
        rotate: 45
    });

    // Finalizar el documento
    doc.end();
    //return outputPDF
    return process.env.PUBLIC_URL+alb
}


module.exports = { createPDF }
