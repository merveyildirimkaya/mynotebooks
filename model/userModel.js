const mongoose = require("mongoose")
const { Schema } = mongoose;
const Joi = require('joi');


const userSchema = new Schema({
  name:{
    type: String, 
    required:true,
    trim: true,
  },
  surname:{
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
  password:
        {
          type: String,
          required:true,
          trim:true,
        }
});

const schema = Joi.object({
  name: Joi.string(),
  surname: Joi.string(),
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


const User = mongoose.model('users', userSchema);

module.exports = User