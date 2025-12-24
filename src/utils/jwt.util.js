const jwt=require('jsonwebtoken');
require('dotenv').config();

class JWTUtil{
    generateToken(payload){
        return jwt.sign(payload,process.env.JWT_SECRET,
            {expiresIn:'1h'});
    }
    verifyToken(token){
        try{
            return jwt.verify(token,process.env.JWT_SECRET);
        }catch(err){
            return null;
        }
    }

    
}

module.exports=new JWTUtil();