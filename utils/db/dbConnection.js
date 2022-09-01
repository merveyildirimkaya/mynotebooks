const  mongoose = require("mongoose");

const connectDatabase = async()=>{
    try {     
        await mongoose.connect('mongodb://localhost:27017/mynotebook');
        console.log("connected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDatabase