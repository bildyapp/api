const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const ClientScheme = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId
        },
        name: {
            type: String
        },
        cif: {
            type: String
        },
        logo: {
            type: String
        },
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        }
    },
    {
        timestamps: true
    }
)

ClientScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("client", ClientScheme) 