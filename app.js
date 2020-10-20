const express= require("express")
const cors= require("cors")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")


require("dotenv/config")

const app=express()



//middlewares


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

//routes

const publicadoresRoutes = require("./routes/publicadores")
app.use("/publicadores", publicadoresRoutes)

const usuariosRoutes = require("./routes/usuarios")
app.use("/usuarios", usuariosRoutes)

const mediosRoutes = require("./routes/medios")
app.use("/medios", mediosRoutes)
const publicosRoutes = require("./routes/publicos")
app.use("/publicos", publicosRoutes)

const recordsRoutes = require("./routes/records")
app.use("/records", recordsRoutes)

const estadisticasRoutes = require("./routes/estadisticas")
app.use("/estadisticas", estadisticasRoutes)
const miscRoutes = require("./routes/misc")
app.use("/misc", miscRoutes)


//base de datos

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log("conectado a la base de datos")
})

//puerto de entrada
app.listen(process.env.PORT)