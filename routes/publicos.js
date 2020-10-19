const express= require("express")
const router= express.Router()

const Publico = require("../models/Publico")

router.get("/getAll", async (req, res) =>{
    try{
        const publicos= await Publico.find()
         
        res.status(200).json(publicos)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})
router.get("/:publicoId", async (req, res) =>{
    try{
        const receivedPublico= await Publico.findOne({ 'idPublico': req.params.publicoId })
        res.status(200).json(receivedPublico)
    }catch(err){
        res.status(403).send()
    }
})

router.post("/", async (req,res) =>{
    const publico= new Publico({
        nombre: req.body.nombre,
        color: req.body.color
    })
    try{
        const savedPublico = await publico.save()
        res.status(200).json(savedPublico)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.delete("/:publicoId", async (req, res) =>{
    try{
        await Publico.remove({ 'idPublico': req.params.publicoId })
        res.status(200).json({message: "Publico eliminado"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})

module.exports = router