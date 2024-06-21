const express = require("express")
const cors = require("cors")
require('dotenv').config();
const dbConnect = require('./config/mongo')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./docs/swagger')


const app = express()

//Le decimos a la app de express() que use cors para evitar el error Cross-Domain (XD)
app.use(cors())
app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
app.use("/api", require("./routes")) //Lee routes/index.js por defecto

app.use(express.static("storage"))

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
})

dbConnect()

module.exports = app
