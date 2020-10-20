const jwt=require("jsonwebtoken")
require("dotenv/config")
module.exports = function authenticateJWT (req,res,next){
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {      
        if (err) {
          return res.status(403).json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.status(403).send({ 
          mensaje: 'Token no provista.' 
      });
    }
}
