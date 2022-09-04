const express = require("express")
const router = express.Router()
const {createCard, getAllCards, getCardById,updateCard,deleteCard} = require("../controller/cardController")
const authMiddleware = require("../utils/middleware/authMiddleware")
const authforNotebooks = require("../utils/middleware/authForNotebooks")
const authforCards = require("../utils/middleware/authforCards")

router.post('/:notebookId', authMiddleware, authforNotebooks, createCard)

router.get('/getAll/:notebookId',authMiddleware,authforNotebooks, getAllCards)

router.get('/:cardId', authMiddleware, authforCards, getCardById)

router.patch('/:cardId', authMiddleware, authforCards, updateCard)

router.delete('/:cardId', authMiddleware, authforCards, deleteCard)

module.exports=router