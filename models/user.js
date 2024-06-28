const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const UserScheme = new mongoose.Schema(
    {
        name: {
            type: String
        },
        surnames: {
            type: String
        },
        nif: {
            type: String
        },
        birthday: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        emailCode: {
            type: String
        },
        attempt: {
            type: Number,
            default: 0
        },
        corporateEmail: {
            type: String
        },
        password:{
            type: String, 
            select: false
        },
        status: {
            type: Number,
            default: 0
        },
        role:{
            type: String,
            enum: ["user", "admin", "guest"], 
            default: "admin"
        },
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        company: {
            name: String,
            cif: String,
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        logo: {
            type: String
        },
        notifications: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

UserScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("user", UserScheme) 