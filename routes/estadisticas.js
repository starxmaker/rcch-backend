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
                            .project({ "nombre" : "$Medio.nombre", "color": "$Medio.color", "total": "$cantidad"})
        const publicos=await Record.aggregate()
                            .match(filters)
                            .group({_id: "$publico", cantidad: { $sum: 1 }})
                            .lookup({from: "publicos", localField: "_id", foreignField: "idPublico", as: "Publico"})
                            .unwind("$Publico")
                            .project({ "nombre" : "$Publico.nombre", "color": "$Publico.color", "total": "$cantidad"})  
        
        var porPublicador=0
        if (countCartas!=0 && countPublicadores.length!=0) porPublicador=countCartas/countPublicadores.length
        const stats={cartas: countCartas, publicadores: countPublicadores.length, textos: sumTextos, revisitas: sumRevisitas, porPublicador: porPublicador, medios: medios, publicos:publicos}
        return stats
    }catch(err){
        return {cartas: 0, publicadores: 0, textos: 0, revisitas: 0, porPublicador: 0, medios: 0, publicos:0}
       
    }
}

module.exports = router