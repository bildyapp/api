const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const ProjectScheme = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId
        },
        clientId: {
            type: mongoose.Types.ObjectId
        },
        name: {
            type: String
        },
        projectCode: {
            type: String
        },
        code: {
            type: String
        },
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        begin: {
            type: String
        },
        end: {
            type: String
        },
        active:{
            type: Boolean,
            default: true
        },
        notes: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

ProjectScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("project", ProjectScheme) 