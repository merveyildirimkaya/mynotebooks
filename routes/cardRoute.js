const express = require("express")
const router = express.Router()
const {createCard, getAllCards, getCardById,updateCard,deleteCard} = require("../controller/cardController")
const authMiddleware = require("../utils/middleware/authMiddleware")

router.post('/:notebookId', authMiddleware, createCard)

router.get('/getAll/:notebookId',authMiddleware, getAllCards)

router.get('/:cardId', authMiddleware, getCardById)

router.patch('/:cardId', authMiddleware, updateCard)

router.delete('/:cardId', authMiddleware, deleteCard)

module.exports=router