const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PublicoSchema=mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "black"
    }
    
})

PublicoSchema.plugin(AutoIncrement, {inc_field: 'idPublico', start_seq:1000});

module.exports= mongoose.model("publicos", PublicoSchema)