const Notebook= require("../model/notebookModel")
const createError = require('http-errors')
const createNotebook= async(req,res,next)=>{

    try {
            req.body.userId=req.user
            const newNotebook= new Notebook(req.body)
            await newNotebook.save()
            const notebook = await Notebook.findById({_id:newNotebook._id},'-__v')
            res.json(notebook)
        
    } catch (error) {
        next(error)
    }

}
const getNotebooks = async (req,res,next)=>{
    try {    
            const myNotebooks = await Notebook.find({userId:req.user},'-__v')
            if(myNotebooks.length>0){
            res.json(myNotebooks)}
            else throw Error(createError(404,"Not Found"))
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