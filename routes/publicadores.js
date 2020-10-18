const express= require("express")
const router= express.Router()

const Publicador = require("../models/Publicador")

router.get("/getAll", async (req, res) =>{
    try{
        const publicadores= await Publicador.find()
        res.json(publicadores)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})
router.get("/:id", async (req, res) =>{
    try{
        const receivedPublicador= await Publicador.findById(res.params.id)
        res.json(receivedPublicador)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.post("/", async (req,res) =>{
    const publicador= new Publicador({
        nombre: req.body.nombre,
        invitado: req.body.invitado,
        grupo: req.body.grupo
    })
    try{
        const savedPublicador = await publicador.save()
        res.json(savedPublicador)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

module.exports = router