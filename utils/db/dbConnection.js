const  mongoose = require("mongoose");

const connectDatabase = async()=>{
    try {     
        await mongoose.connect('mongodb://localhost:27017/mynotebook');
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDatabase