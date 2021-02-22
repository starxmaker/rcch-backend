const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")

router.use(authenticateJWT)

const Record = require("../models/Record")

router.get("/getAll", async (req, res) =>{
    try{
        const records= await Record.find().sort({'_id': -1})
        
         
        res.status(200).json(records)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.get("/getLast", async (req, res) =>{
    try{
        const records= await Record.aggregate()
        .lookup({from: "medios", localField: "medio", foreignField: "idMedio", as: "Medio"})
        .unwind("$Medio")
        .lookup({from: "publicadores", localField: "publicador", foreignField: "idPublicador", as: "Publicador"})
        .unwind("$Publicador")
        .lookup({from: "publicos", localField: "publico", foreignField: "idPublico", as: "Publico"})
        .unwind("$Publico")
        .project({
             "id": "$idRecord",
             "hora_year":"$hora_year",
             "hora_month": "$hora_month",
             "hora_day": "$hora_day",
             "hora_hour": "$hora_hour",
             "hora_minute": "$hora_minute",
             "hora_second": "$hora_second",
             "textos": "$textos",
             "tipo": "$tipo",
             "videoAdjunto": "$videoAdjunto",
             "publicacionAdjunta": "$publicacionAdjunta",
             "medio" : "$Medio.nombre",
             "publicador" : "$Publicador.nombre",
             "publico": "$Publico.nombre"
        }).sort({'id': -1}).limit (50)
          
        res.status(200).json(records)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})
router.get("/:year/:month/:day", async (req, res) =>{
    try{
        const records= await Record.find({
            "hora_year":req.params.year,
            "hora_month":req.params.month,
            "hora_day": req.params.day
        })
         
        res.status(200).json(records)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})
router.get("/:recordId", async (req, res) =>{
    try{
        const receivedRecord= await Record.findOne({ 'idRecord': req.params.recordId })
        res.status(200).json(receivedRecord)
    }catch(err){
        res.status(403).send()
    }
})

router.post("/", async (req,res) =>{
    const record= new Record({
        publicador: req.body.publicador,
        medio: req.body.medio,
        publico:req.body.publico,
        textos: req.body.textos,
        tipo: req.body.tipo,
        videoAdjunto: req.body.videoAdjunto,
        publicacionAdjunta: req.body.publicacionAdjunta
    })
    try{
        const savedRecord = await record.save()
        res.status(200).json(savedRecord)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.delete("/:recordId", async (req, res) =>{
    try{
        await Record.remove({ 'idRecord': req.params.recordId })
        res.status(200).json({message: "Registro eliminado"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})

module.exports = router