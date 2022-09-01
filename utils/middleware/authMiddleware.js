const jwt = require('jsonwebtoken');
const User = require("../../model/userModel")
const authMiddleware = async (req,res,next)=>{
    try {
        if(req.header('Authorization')){
            const token = req.header('Authorization').replace("Bareer ", "")
            verifiedUser = jwt.verify(token,"mynotebook")
           
            const user= await User.findOne({_id:verifiedUser.userId}) 
            req.user=user
        } 
        next()
    } catch (error) {
        next(error)
    }
  
}

module.exports= authMiddleware