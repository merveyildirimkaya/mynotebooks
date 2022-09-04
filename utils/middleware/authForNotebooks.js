const Notebook = require("../../model/notebookModel")
const createError = require('http-errors')

const authMiddlewareforNotebooks = async (req,res,next)=>{
    try {
        const notebook = await Notebook.findById(req.params.notebookId)
        if (!((req.user._id).equals((notebook.userId).toString()))){
           throw new Error(createError(401,"Access denied!"))
        }else req.notebook = notebook
        next()
    } catch (error) {
        next(error)
    }
  
}

module.exports= authMiddlewareforNotebooks