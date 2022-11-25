const express = require("express")
const router = express.Router()
const {createCard, getAllCards, getCardById,updateCard,deleteCard,getRandomCard} = require("../controller/cardController")
const authMiddleware = require("../utils/middleware/authMiddleware")
const accessForNotebooks = require("../utils/middleware/accesForNotebooks")
const accessForCards = require("../utils/middleware/accessForCards")

router.post('/:notebookId', authMiddleware, accessForNotebooks, createCard)

router.get('/getAll/:notebookId',authMiddleware,accessForNotebooks, getAllCards)

router.get('/getRandom/:notebookId',authMiddleware,accessForNotebooks,getRandomCard)


router.get('/:cardId', authMiddleware, accessForCards, getCardById)

router.patch('/:cardId', authMiddleware, accessForCards, updateCard)

router.delete('/:cardId', authMiddleware, accessForCards, deleteCard)

module.exports=router