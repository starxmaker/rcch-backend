const express= require("express")
require("dotenv/config")
const app=express()

app.get("/", (req, res) =>{
    res.send("Prueba de funcionamiento")
})
app.listen(process.env.PORT)