const mongoose = require("mongoose")

const PublicadorSchema=mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    invitado: {
        type: Boolean,
        default:true
    },
    grupo: {
        type: Number,
        default: 0
    }
})

module.exports= mongoose.model("Publicadores", PublicadorSchema)