const mongoose = require('mongoose');
const {Schema}= mongoose

const languageSchema = new Schema({
    language:{
        type: String,
        required:true,
        trim:true,
        upperCase:true,
    },
    icon:{
        type:String,
        required:true,
    },
    wordClasses:{
        type: Array,
        required:true,
    },
})

const Language = mongoose.model('languages', languageSchema);

module.exports = Language