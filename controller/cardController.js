const Card = require("../model/cardModel")

const createCard= async(req,res,next)=>{
    
    try {
            req.body.notebookId=req.notebook._id
            const newCard = new Card(req.body)
            await newCard.save()
            const card = await Card.findById({_id:newCard._id},'-__v')
            return res.json(card)
    } catch (error) {
       next(error)
    }
}

const getAllCards= async(req,res,next)=>{
    try {
            const cards = await Card.find({notebookId:req.notebook},'-__v')
            return res.json(cards)}
     catch (error) {
       next(error)
    }
}

const getCardById= async(req,res,next)=>{
    try {
           return res.json(req.card)  
    } catch (error) {
        next(error)}
}

const updateCard= async(req,res,next)=>{

    delete req.body.notebookId
    try {
         const card =  await Card.findByIdAndUpdate({_id:req.card._id},req.body,{new:true, select: "-__v",runValidators:true})
         return res.json(card)
    } catch (error) {
        next(error)
    }
}

const deleteCard= async(req,res,next)=>{
    try {
            await Card.findByIdAndDelete({_id:req.card._id})
            return res.json({message:"card has been deleted"})
    } catch (error) {
        next(error)
    }
}


module.exports = {createCard, getAllCards,getCardById,updateCard,deleteCard}