const express= require("express")
const router= express.Router()

const Medio = require("../models/Medio")

router.get("/getAll", async (req, res) =>{
    try{
        const medios= await Medio.find()
         
        res.status(200).json(medios)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})
router.get("/:medioId", async (req, res) =>{
    try{
        const receivedMedio= await Medio.findOne({ 'idMedio': req.params.medioId })
        res.status(200).json(receivedMedio)
    }catch(err){
        res.status(403).send()
    }
})

router.post("/", async (req,res) =>{
    const medio= new Medio({
        nombre: req.body.nombre,
        color: req.body.color
    })
    try{
        const savedMedio = await medio.save()
        res.status(200).json(savedMedio)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.delete("/:medioId", async (req, res) =>{
    try{
        await Medio.remove({ 'idMedio': req.params.medioId })
        res.status(200).json({message: "Medio eliminado"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})

module.exports = router