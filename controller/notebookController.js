const Notebook= require("../model/notebookModel")
const Language = require("../model/languageModel")

const createNotebook= async(req,res,next)=>{

    try {
            
            const language = await Language.findOne({language:req.body.language})
          
            req.notebook={
                userId:req.user,
                language:language
            }

      
            const newNotebook= new Notebook(req.notebook)
            await newNotebook.save()
            const notebook = await Notebook.findById({_id:newNotebook._id},'-__v').populate('language')
            res.json(notebook)
        
    } catch (error) {
        next(error)
    }

}
const getNotebooks = async (req,res,next)=>{
    try {    
            const myNotebooks = await Notebook.find({userId:req.user},'-__v').populate('language')
           // if(myNotebooks.length>0){
            res.json(myNotebooks)
        //}
           // else throw Error(createError(404,"Not Found"))
    } catch (error) {
        next(error)
    }
}

const deleteNoteBook = async(req,res,next)=>{
    try 
    { 
        await Notebook.deleteOne({_id:req.notebook._id})
        res.json({
            _id:req.notebook._id,
            userId:req.notebook.userId,
            language:req.notebook.language
        })
    } catch (error) {
       next(error)
    }
}
module.exports = {createNotebook, getNotebooks, deleteNoteBook}