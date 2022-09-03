const  mongoose = require("mongoose");

const connectDatabase = async()=>{
    try {     
        await mongoose.connect('mongodb://localhost:27017/mynotebook');
    } catch (error) {
   
    }
}

const disconnectDatabase = async()=>{
    try {     
        await mongoose.connection.close()
    } catch (error) {
     
    }
}
module.exports = {connectDatabase,disconnectDatabase}