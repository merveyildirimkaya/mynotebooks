const jwt = require('jsonwebtoken');
const User = require("../../model/userModel")
const createError = require('http-errors')
const authMiddleware = async (req,res,next)=>{
    try {
        if(req.header('Authorization')){
            const token = req.header('Authorization').replace("Bareer ", "")
            verifiedUser = jwt.verify(token,"mynotebook")
           
            const user= await User.findOne({_id:verifiedUser.userId}) 
            req.user=user
            next()
            
        } else {
            const err = createError(401, 'Please login to view this page.')
            throw Error(err)
        }
    } catch (error) {
        next(error)
    }
  
}

module.exports= authMiddleware