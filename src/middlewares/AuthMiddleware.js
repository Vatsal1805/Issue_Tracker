const jwt=require('jsonwebtoken');
const UserRepository=require('../repositories/UserRepository');
const apiError=require('../errors/Apierror');

class AuthMiddleware{
    async authenticate(req,res,next){
        try{
            const authHeader=req.headers.authorization;
            if(!authHeader || !authHeader.startsWith('Bearer ')){
                throw new apiError(401,'No token provided');
            }
            const token=authHeader.split(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            const user=await UserRepository.findById(decoded.id);

            if(!user){
                throw new apiError(401,'Invalid token');
            }
            req.user=user;
            next();
        }
        catch(error){
            next(new apiError(401,'Authentication failed'));
        }
    }
}
module.exports=new AuthMiddleware();