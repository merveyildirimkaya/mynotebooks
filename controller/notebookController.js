const Notebook= require("../model/notebookModel")

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
            else throw Error("You have not created any notebook yet")
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