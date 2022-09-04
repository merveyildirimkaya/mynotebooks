const Card = require("../../model/cardModel")
const Notebook = require("../../model/notebookModel")
const deleteCards= async(req,res,next)=>{

    try {
        const notebooks = await Notebook.find({userId:req.user}) 
        notebooks.forEach(async (notebook)=>{
             await Card.deleteMany({notebookId:notebook._id})
        })
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = deleteCards