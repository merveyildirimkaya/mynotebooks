const  mongoose = require("mongoose");
require("dotenv").config()

const connectDatabase = async()=>{
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/mynotebook",{ useNewUrlParser: true, useUnifiedTopology: true});
        
    } catch (error) {
        console.log(error)
    }

}

module.exports = {connectDatabase}

