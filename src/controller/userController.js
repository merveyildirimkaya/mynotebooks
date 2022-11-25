const User = require("../model/userModel")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const createError = require('http-errors')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const {validationResult}= require('express-validator')
const path =require("path")
require("dotenv").config() 

const register= async (req,res,next)=>{
    try {
        const {error,value} = User.joiValidationforRegister(req.body)
        if(error) throw Error(createError(400, error))
        const newUser = new User(value)
        const  hash =  await bcrypt.hash(value.password, saltRounds)
        newUser.password=hash

        const user = await User.findOne({userName: newUser.userName})  
        if(!user) { await newUser.save()}
        else if(user && !user.isEmailActive){
           await User.findByIdAndRemove({_id: user._id})
           await newUser.save()
        }
        else if(user && user.isEmailActive) throw Error(createError(400, "Username is already in use"))
    

        // generate jwt
        jwtObj ={
            email: newUser.email,
            id: newUser._id
        }

        const token = jwt.sign(jwtObj, "secretKey" , {expiresIn: "1d"})

        //send mail

           const url = process.env.WEB_SITE_URL + 'user/' + 'verify?_token=' +token;
          

           let transporter = nodemailer.createTransport({
               service: 'gmail',
               auth:{
                   user: process.env.GMAIL_USER,
                   pass: process.env.GMAIL_PASSWORD
                }
           })

           await transporter.sendMail({
               from:'Mynotebooks <my@notebooks.com',
               to:newUser.email,
               subject:"Please verify your email",
               text: "click here to verify your email :" +url
           },(error,info)=>{
               if(error){
                   console.log(error)
               }else {
                   console.log('mail gönderildi')
                   console.log(info)
                   transporter.close()
               }
           })
          
       // const user = await User.findOne({userName: newUser.userName},'-__v -password')
        res.json({message:"Please verify your email"})
       
            }catch (error){
        next(error)
    }
   
}
const verifyEmail = async(req, res, next)=>{
 

    const token = req.query._token

    const value = jwt.verify(token, "secretKey")

    if(value){
        const user = await User.findByIdAndUpdate(value.id, {isEmailActive:true})
        res.send("EMAIL SUCCESSFULLY VERIFIED, PLEASE LOGIN")
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
      if(user.isEmailActive){
      const token = jwt.sign({userId:user._id, password:user.password}, process.env.SECRET_KEY ,{ expiresIn: '1h' });
            res.json({
                token:token})}else throw Error(createError(400,"Please verify your email"))
        } else throw Error(createError(400,"Invalid Credentials"))
    } catch (error) {
        next(error)
    }
}

const resetPasswordForm = async (req,res,next)=>{
    const id = req.params._id
    
    if(id && req.params.token){

        const user =  await User.findById({_id:id})

        const secretKey = process.env.RESET_PASSWORD_SECRET +"-"+ user.password

        if(user){  
            try {
                jwt.verify(req.params.token,secretKey, async(error,decoded)=>
                    {
                        if(error){
                            req.flash('error', 'Kod Hatali veya süresi gecmis')
                            res.redirect('/forgot-password')
                        }
                        else
                        {
                           res.render('new_password',{_id:id, token: req.params.token,layout: './layout/auth_layout.ejs'})
                        }
                    })
           
        } catch (error) {
         
        }
        }
    }

   
  
}


const resetPassword= async (req,res,next)=>{

   
    const errorArr = validationResult(req)
    
    if(!errorArr.isEmpty()){ 
     
      req.flash('validation_error', errorArr.array())
      req.flash('password', req.body.password)
      req.flash('repeatpassword', req.body.repeatpassword)
      res.redirect('reset-password/'+req.body._id+"/"+req.body.token)
     
    }else{
   
    
       try {
        const _founduser = await User.findOne({_id : req.body._id, isEmailActive: true})
        
    
        const secretKey = process.env.RESET_PASSWORD_SECRET +"-"+ _founduser.password

        
        jwt.verify(req.body.token, secretKey,async(error,decoded)=>{
            if(!error){
                
                const hashedPass =  await bcrypt.hash(req.body.password,10)
                
                await User.findByIdAndUpdate({_id:decoded.id},{password:hashedPass})
                
                req.flash('success_message', [{msg:"Password successfully changed"}])
                res.send("Pass has changed")
            }else console.log(error)
        })

      
       
       } catch (error) {
        console.log(error)
       }
        
    
    }
}

const forgotPassword = async (req,res,next)=>{
   
    if(req.body.email){
        try {
            const user = await User.findOne({email:req.body.email, isEmailActive:true})
        
            if(!user){
            throw Error(createError(404, "Not found"))
            }
            jwtInfo={
                id:user._id,
                email:user.email
            }

            const secretKey = process.env.RESET_PASSWORD_SECRET +"-" +user.password
            const token= jwt.sign(jwtInfo,secretKey,{expiresIn:"1d"})
        
            //send mail
            const url = process.env.WEB_SITE_URL + 'user/' + 'reset-password/' +user._id + "/" + token

           
            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASSWORD
                }
            })

            await transporter.sendMail({
                from:'Mynotebooks <my@notebooks.com',
                to:user.email,
                subject:"Please reset your pass",
                text: "click here to reset your pass :" +url
            },(error,info)=>{
                if(error){
                    console.log(error)
                }else {
                    console.log('mail gönderildi')
                    transporter.close()
                    res.json({msg:"Please check your mailbox"})
                }
            })
        } catch (error) {
            console.log(error)
        }
        
    }
}

const getUser = async(req,res,next)=>{
   
    try {
        res.json({
            _id:req.user._id,
            name:req.user.name,
            userName:req.user.userName,
            image:req.user.image
        })
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
            
            res.json({
                _id:req.user._id,
                name:req.user.name,
                surname:req.user.surname,
                userName:req.user.userName
            })    
        
    }catch(error){
       next(error)
    }
}

const uploadPhoto = async(req,res,next)=>{
    try {
        const user = await User.findByIdAndUpdate({_id:req.user._id},{image:req.file.filename})
      
    } catch (error) {
        console.log(error)
        
    }
}

const getUploadedPhoto = async(req,res,next)=>{
    let fileLocation = path.join(__dirname, '../uploads/avatars', req.user.image);
    console.log(fileLocation)
    res.sendFile(`${fileLocation}`)
}
module.exports = {register,login,deleteAccount,
    updateProfil,changePassword,getUser,
    verifyEmail,resetPasswordForm,forgotPassword,
    resetPassword,uploadPhoto,getUploadedPhoto
}