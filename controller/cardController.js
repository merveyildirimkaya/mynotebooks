const Card = require("../model/cardModel")
const Notebook = require("../model/notebookModel")

const createCard= async(req,res,next)=>{
    
    try {
        const notebook= await Notebook.findById({_id:req.params.notebookId})
            if((req.user._id).equals((notebook.userId).toString())){
                req.body.notebookId=notebook._id
                const newCard = new Card(req.body)
                await newCard.save()
                const card = await Card.findById({_id:newCard._id},'-__v')
                return res.json(card)}
            else throw Error("notebook does not belong to you")
    } catch (error) {
       next(error)
    }
}

const getAllCards= async(req,res,next)=>{
    try {
        const notebook= await Notebook.findById({_id:req.params.notebookId})
            if((req.user._id).equals((notebook.userId).toString())){
            const cards = await Card.find({notebookId:notebook},'-__v')
            return res.json(cards)}
            else throw Error("notebook does not belong to you")
    } catch (error) {
       next(error)
    }
}

const getCardById= async(req,res,next)=>{
    try {
        const card = await Card.findById({_id:req.params.cardId},'-__v')
        const notebook= await Notebook.findById({_id:card.notebookId})
        if((req.user._id).equals((notebook.userId).toString())){
           return res.json(card) } 
           else throw Error("notebook does not belong to you")  
    } catch (error) {
        next(error)}
}

const updateCard= async(req,res,next)=>{

    delete req.body.notebookId

    try {
        const card = await Card.findById({_id:req.params.cardId})
        const notebook= await Notebook.findById({_id:card.notebookId})
        if((req.user._id).equals((notebook.userId).toString())){
            await Card.findByIdAndUpdate({_id:req.params.cardId},req.body,{runValidators:true})
            const card = await Card.findById({_id:req.params.cardId},'-__v')
            return res.json(card)}  
            else throw Error("notebook does not belong to you")
    } catch (error) {
        next(error)
    }
}

const deleteCard= async(req,res,next)=>{
    try {

        const card = await Card.findById({_id:req.params.cardId})
        const notebook= await Notebook.findById({_id:card.notebookId})
        if((req.user._id).equals((notebook.userId).toString())){
            await Card.findByIdAndDelete({_id:req.params.cardId})
            return res.json({message:"card has been deleted"})}
            else throw Error("notebook does not belong to you")
    } catch (error) {
        next(error)
    }
}


module.exports = {createCard, getAllCards,getCardById,updateCard,deleteCard}