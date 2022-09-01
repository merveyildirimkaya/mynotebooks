const User = require("../model/userModel")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const createError = require('http-errors')
const jwt = require('jsonwebtoken');

const register=(req,res,next)=>{
    try {
        const newUser = new User(req.body)

        bcrypt.hash(req.body.password, saltRounds,  async function(err, hash) {
            
            if(!err){
            newUser.password=hash
            try {
                await newUser.save();
                res.json(newUser)
            } catch (error) {
                next(error)
            }
            
        }else res.json({
            statusCode:"400",
            message:"error while crypting password"
        })
        })
    } catch (error) {
     
        error.statusCode=404
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
            res.json({token:token})
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
        res.json(updatedUser)
        
    }catch(error){
        next(error)
    }
}

const changePassword =async(req,res)=>{



    try {
            bcrypt.hash(req.body.password,saltRounds,async function(err,result){
                const updatedPassword=await User.findByIdAndUpdate({_id:req.user._id},{password:result}, {new: true,runValidators:true}) 
                res.json(updatedPassword)
            })
        
    }catch(error){
     
       next(error)
    }
}

const deleteAccount=async(req,res)=>{
    try { 
            await User.deleteOne({_id:req.user._id})
            res.json({message:"User has been deleted"})
        
    }catch(error){
       next(error)
    }
}
module.exports = {register,login,deleteAccount,updateProfil,changePassword}