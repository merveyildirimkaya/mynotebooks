const Card = require("../../model/cardModel")

const deleteCards= async(req,res,next)=>{

    try {
             await Card.deleteMany({notebookId:req.notebook._id})
             next()
    } catch (error) {
        next(error)
    }
}

module.exports = deleteCards