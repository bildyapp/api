const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

// Reemplaza con tus claves de API de Pinata
const pinataApiKey = process.env.PINATA_KEY
const pinataSecretApiKey = process.env.PINATA_SECRET

// Ruta al archivo que deseas subir
//const filePath = path.join(__dirname, 'archivo-a-subir.ext'); // Reemplaza 'archivo-a-subir.ext' con tu archivo

const uploadToPinata = async (filePath) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', fs.createReadStream(filePath));
/*
    const metadata = JSON.stringify({
        name: 'bildy',
        keyvalues: {
            type: 'logo'
        }
    });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', options);
*/
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }

        const responseData = await response.json();
        //console.log('Archivo subido con éxito:', responseData);
        return responseData.IpfsHash
    } catch (error) {
        console.error('Error al subir el archivo:', error);
    }
};

const uploadToPinata2 = async (fileBuffer, fileName) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', fileBuffer, fileName);

    const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', options);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al subir el archivo a Pinata:', error);
        throw error;
    }
};

const uploadIPFS = async (fileToUpload) => {
    try {
        //setUploading(true)
        console.log("FILE:", fileToUpload)
        const data = new FormData()
        data.set("file", fileToUpload)
        const res = await fetch("/api/files", {
            method: "POST",
            body: data,
        })
        const resData = await res.json()
        setCid(resData.IpfsHash)
        //setUploading(false);
        console.log(resData)
        return resData.IpfsHash
    } catch (e) {
        console.log(e)
        //setUploading(false);
    }
};

module.exports = { uploadIPFS, uploadToPinata, uploadToPinata2 }