const mongoose = require("mongoose")
const { Schema } = mongoose;

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

const User = mongoose.model('users', userSchema);

module.exports = User