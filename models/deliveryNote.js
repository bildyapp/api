const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const DeliveryNoteScheme = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId
        },
        clientId: {
            type: mongoose.Types.ObjectId
        },
        projectId: {
            type: mongoose.Types.ObjectId,
            ref: 'project'
        },
        internalProjectCode: {
            type: String
        },

        format:{
            type: String,
            enum: ["material","hours"]
        },

        /* material delivery note added */
        material: {
            type: String
        },
        quantity: {
            type: Number
        },
        unit: {
            type: String
        },
        /* hours delivery note added */
        hours: {
            type: Number
        },

        description: {
            type: String
        },
        observations: {
            type: String
        },
        workdate: {
            type: String
        },
        sign: {
            type: String
        },
        pending: {
            type: Boolean,
            default: true
        },
        pdf: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

DeliveryNoteScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("deliveryNote", DeliveryNoteScheme) 