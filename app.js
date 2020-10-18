const express= require("express")
const app=express()

app.get("/", (req, res) =>{
    res.send("Prueba de funcionamiento")
})
app.listen(3000)