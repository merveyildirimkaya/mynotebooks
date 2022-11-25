const Notebook = require("../../model/notebookModel")

const deleteNotebooks= async(req,res,next)=>{

    try {
        await Notebook.deleteMany({userId:req.user})
    } catch (error) {
        next(error)
    }
    next()
}

module.exports = deleteNotebooks