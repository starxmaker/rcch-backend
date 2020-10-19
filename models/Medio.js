const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const MedioSchema=mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "black"
    }
    
})

MedioSchema.plugin(AutoIncrement, {inc_field: 'idMedio', start_seq:1000});

module.exports= mongoose.model("medios", MedioSchema)