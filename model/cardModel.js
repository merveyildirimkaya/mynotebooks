const mongoose = require('mongoose');
const {Schema}= mongoose
const types=require("../enum/phraseTypes")

const cardSchema = new Schema({
    notebookId:{
        type:Schema.Types.ObjectId,
        ref:"notebooks"
    },
    type:{
        type:String,
        required:true,
        enum: Object.keys(types)
    },
    phrase:{
        type: String,
        required:true,
        trim:true,
        upperCase:true,
        uniqe:true
    },
    definition:{
        type: String,
        required:true,
        trim:true,
    },
    tabooOne:{
        type:String,
        required:true,
        trim:true,
        upperCase:true,
    },
    tabooTwo:{
        type:String,
        required:true,
        trim:true,
        upperCase:true,
    },
    tabooThree:{
        type:String,
        required:true,
        trim:true,
        upperCase:true,
    }
})

const Card = mongoose.model('cards', cardSchema);

module.exports = Card