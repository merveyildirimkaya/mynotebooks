const Notebook= require("../model/notebookModel")

const createNotebook= async(req,res,next)=>{

    try {
            req.body.userId=req.user
            const newNotebook= new Notebook(req.body)
            await newNotebook.save()
            res.json(newNotebook)
        
    } catch (error) {
        next(error)
    }

}
const getNotebooks = async (req,res,next)=>{
    try {    
            const myNotebooks = await Notebook.find({userId:req.user})
            res.json(myNotebooks)
        
    } catch (error) {
        next(error)
    }
}

const deleteNoteBook = async(req,res,next)=>{
    try 
    { 
        const notebook = await Notebook.findById(req.params.notebookId)
                if ((req.user._id).equals((notebook.userId).toString())){
                    await Notebook.deleteOne({_id:notebook._id})
                  res.json({message:"notebook has been deleted"})
                }else throw new Error("access denied")
    } catch (error) {
       next(error)
    }
}
module.exports = {createNotebook, getNotebooks, deleteNoteBook}