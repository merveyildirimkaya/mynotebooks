const Notebook = require("../../model/notebookModel")
const Card = require("../../model/cardModel")
const createError = require('http-errors')

const accessForCards = async (req,res,next)=>{

    try {
        const card = await Card.findById({_id:req.params.cardId})
        const notebook= await Notebook.findById({_id:card.notebookId})
        if((req.user._id).equals((notebook.userId).toString())){
            req.card = card
            next()
        }else
       throw new Error(createError(403,"Access denied!"))
    } catch (error) {
        next(error)
    }
}

module.exports= accessForCards