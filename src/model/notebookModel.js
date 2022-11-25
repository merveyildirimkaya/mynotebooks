const mongoose = require('mongoose');
const {Schema}= mongoose
//const languages= require("../enum/languages")

const notebookSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    language:{
        // type: String,
        // enum:Object.values(languages),
        type: Schema.Types.ObjectId, 
        ref: 'languages',
        required:true
    }
})

const Notebook = mongoose.model('notebooks', notebookSchema);

module.exports = Notebook