const mongoose = require("mongoose")
const { Schema } = mongoose;
const Joi = require('joi');


const userSchema = new Schema({

  email:{
    type: String, 
    required:true,
    trim:true
  },
  isEmailActive:{
    type: Boolean,
    default:false
  },
  name:{
    type: String, 
    required:true,
    trim: true,
  },
  userName:  
  { 
    type: String, 
    required:true,
    unique: true,
    trim: true,
    maxLength:15,
    minLengt:5
  },  
  image:{
    type:String,
    default:"default.png"
  },
  password:
  {
    type: String,
    required:true,
    trim:true,
  }
});

const schema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  userName: Joi.string().min(5).max(15),
  password: Joi.string().min(6).max(10)
})

userSchema.statics.joiValidationforRegister=(userObject)=>{
  schema.required()
  return schema.validate(userObject)
}

userSchema.statics.joiValidation=(userObject)=>{
   return schema.validate(userObject)
}


const User = mongoose.model('users', userSchema,);

module.exports = User