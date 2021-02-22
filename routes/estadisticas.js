const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")

router.use(authenticateJWT)

const Record = require("../models/Record")


router.get("/today", async (req, res) =>{
    const stats=await getStats(new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate())
    res.status(200).json(stats)
})
router.get("/:year/:month/:day", async (req, res) =>{
    const stats=await getStats(req.params.year, req.params.month, req.params.day)
    res.status(200).json(stats)
})

async function getStats(year, month, day){
    try{
        const filters={hora_year: {$eq: parseInt(year)}, hora_month: {$eq: parseInt(month)}, hora_day: {$eq: parseInt(day)}}
        const countCartas= await Record.countDocuments(filters)
        const filtersVideos={...filters, videoAdjunto: {$eq: true}}
        const countVideos= await Record.countDocuments(filtersVideos)
        const filtersPublicaciones={...filters, publicacionAdjunta: {$eq: true}}
        const countPublicaciones= await Record.countDocuments(filtersPublicaciones)
        const countPublicadores= await Record.find(filters).distinct("publicador")
        const textos= await Record.aggregate()
                                    .match(filters)
                                    .group({_id: null, "TotalAmount": { $sum: "$textos"}})
        var sumTextos = 0
        if (textos.length>0) sumTextos=textos[0].TotalAmount
        const revisitas= await Record.aggregate()
                                        .match(filters)
                                        .project({_id:0, revisitas: {$cond: [{$eq: ["$tipo", 1]}, 1, 0] } })
                                        .group({_id:null, Revisitas: { $sum: "$revisitas"}})
        var sumRevisitas=0
        if (revisitas.length>0) sumRevisitas=revisitas[0].Revisitas
        const medios=await Record.aggregate()
                            .match(filters)
                            .group({_id: "$medio", cantidad: { $sum: 1 }})
                            .lookup({from: "medios", localField: "_id", foreignField: "idMedio", as: "Medio"})
                            .unwind("$Medio")
                            .project({ "title" : "$Medio.nombre", "color": "$Medio.color", "value": "$cantidad"})
        const publicos=await Record.aggregate()
                            .match(filters)
                            .group({_id: "$publico", cantidad: { $sum: 1 }})
                            .lookup({from: "publicos", localField: "_id", foreignField: "idPublico", as: "Publico"})
                            .unwind("$Publico")
                            .project({ "title" : "$Publico.nombre", "color": "$Publico.color", "value": "$cantidad"})  
        const revisitaDiff=[{
            "title": "Revisitas",
            "color": "Orange",
            "value": sumRevisitas
        }, {
            "title": "Primera conversación",
            "color": "Purple",
            "value": countCartas-sumRevisitas
        }]                    
        
        const stats={cartas: countCartas, publicadores: countPublicadores.length, textos: sumTextos, revisitas: sumRevisitas, medios: medios, publicos:publicos, revisitaDiff:revisitaDiff, publicaciones: countPublicaciones, videos: countVideos}
        return stats
    }catch(err){
        return {cartas: 0, publicadores: 0, textos: 0, revisitas: 0,  medios: 0, publicos:0, revisitaDiff: 0, publicaciones: 0, videos: 0}
       
    }
}

module.exports = router