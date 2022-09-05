const  mongoose = require("mongoose");
require("dotenv").config()

const connectDatabase = async()=>{
    
    await mongoose.connect(process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/mynotebook",{ useNewUrlParser: true, useUnifiedTopology: true});

}

module.exports = {connectDatabase}

