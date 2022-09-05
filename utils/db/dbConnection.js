const  mongoose = require("mongoose");
require("dotenv").config()

const connectDatabase = async()=>{
    
    await mongoose.connect(process.env.DB_CONNECTION_STRING,{ useNewUrlParser: true, useUnifiedTopology: true});

}

module.exports = {connectDatabase}

