const User = require("../model/userModel")
const bcrypt = require('bcrypt');
const saltRounds = 10;
//const createError = require('http-errors')
const jwt = require('jsonwebtoken');



const register=(req,res,next)=>{
    try {
        const newUser = new User(req.body)

        bcrypt.hash(req.body.password, saltRounds,  async function(err, hash) {
            
            if(!err){
            newUser.password=hash
            try {
                await newUser.save();
                res.json({
                    name:newUser.name,
                    surname:newUser.surname,
                    userName:newUser.userName
                })
            } catch (error) {
                next(error)
            }
            
        }else res.json({
            statusCode:"400",
            message:"error while crypting password"
        })
        })
    } catch (error) {
     
        next(error)
     
    }
}
const login= async(req,res,next)=>{
  
    try {
      const user= await User.findOne({userName:req.body.userName})

        
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if(err){
            res.json({
                statusCode:400,
                message:"Something went wrong"
            })
        }
        else if(result){
            const token = jwt.sign({userId:user._id, password:user.password}, 'mynotebook',{ expiresIn: '1h' });
            res.json({
                user:{
                    _id:user._id,
                    name:user.name,
                    surname:user.surname,
                    userName:user.userName
                },
                token:token})
        }else
        {
            res.json({
                statusCode:400,
                message:"Invalid Credentials"
            })
        }
      }
      );
    } catch (error) {
        next(error)
    }
}


const updateProfil=async(req,res,next)=>{

    delete req.body.password
    delete req.body._id
    delete req.body.__v

    try {
        const updatedUser=await User.findByIdAndUpdate({_id:req.user._id},req.body, {new: true,runValidators:true})
        res.json({  name:updatedUser.name,
                    surname:updatedUser.surname,
                    userName:updatedUser.userName
                })
        
    }catch(error){
        next(error)
    }
}

const changePassword =async(req,res)=>{

    try {
            bcrypt.hash(req.body.password,saltRounds,async function(err,result){
                const updatedPassword=await User.findByIdAndUpdate({_id:req.user._id},{password:result}, {new: true,runValidators:true}) 
                res.json({
                    user: updatedPassword.userName ,
                    message:"Password has been changed"})
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