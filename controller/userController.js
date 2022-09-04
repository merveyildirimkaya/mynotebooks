const User = require("../model/userModel")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const createError = require('http-errors')
const jwt = require('jsonwebtoken');


const register= async (req,res,next)=>{
    try {
        const {error,value} = User.joiValidationforRegister(req.body)
        if(error) throw Error(createError(400,"Bad Request"))
        const newUser = new User(value)
        const  hash =  await bcrypt.hash(value.password, saltRounds)
       
            newUser.password=hash
            await newUser.save();
            const user = await User.findOne({userName: newUser.userName},'-__v -password')
            res.json(user)
       
            }catch (error){
        next(error)
    }
   
}
const login= async(req,res,next)=>{
  
    try {

      const {error,value} = User.joiValidation(req.body)
      if(error) throw Error(createError(400,"Bad Request"))

      const password= await User.findOne({userName:value.userName},'password')

      const result= await bcrypt.compare(req.body.password, password.password)

      if(result){
      const user = await User.findOne({userName:value.userName},'-__v -password')
      const token = jwt.sign({userId:user._id, password:user.password}, 'mynotebook',{ expiresIn: '1h' });
            res.json({
                user:user,
                token:token})
        } else throw Error(createError(400,"Invalid Credentials"))
    } catch (error) {
        next(error)
    }
}


const updateProfil=async(req,res,next)=>{

    delete req.body.password
    delete req.body._id
    delete req.body.__v

    try {

        const {error,value} = User.joiValidation(req.body)
        if(error) throw Error(createError(400,"Bad Request"))

        const updatedUser=await User.findByIdAndUpdate({_id:req.user._id},value, {new: true, select: "name surname userName",runValidators:true})
        res.json(updatedUser)
        
    }catch(error){
        next(error)
    }
}

const changePassword =async(req,res)=>{
    
    const {error,value} = User.joiValidation(req.body)
    if(error) throw Error(createError(400,"Bad Request"))

    try {
            const result = await bcrypt.hash(value.password,saltRounds)
                const updatedPassword=await User.findByIdAndUpdate({_id:req.user._id},{password:result}, {new: true,runValidators:true}) 
                res.json({
                    user: updatedPassword.userName ,
                    message:"Password has been changed"
                })      
    }catch(error){
       next(error)
    }
}

const deleteAccount=async(req,res,next)=>{
    try { 
            await User.deleteOne({_id:req.user._id})
            res.json({message:"User has been deleted"})     
    }catch(error){
       next(error)
    }
}
module.exports = {register,login,deleteAccount,updateProfil,changePassword}