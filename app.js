const express= require("express")
const cors= require("cors")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const jwt=require("jsonwebtoken")
require("dotenv/config")

const app=express()

app.set("llave", process.env.JWT_KEY)


//middlewares

app.use((req, res, next) => {
    if (req.url=="/usuarios/login"){
        next()
        return;
    }
    
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, app.get('llave'), (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no provista.' 
      });
    }
 });

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

//routes

const publicadoresRoutes = require("./routes/publicadores")
app.use("/publicadores", publicadoresRoutes)

const usuariosRoutes = require("./routes/usuarios")
app.use("/usuarios", usuariosRoutes)

app.get("/", (req, res) =>{
    res.send("Prueba de funcionamiento")
})

//base de datos

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log("conectado a la base de datos")
})

//puerto de entrada
app.listen(process.env.PORT)