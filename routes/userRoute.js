const express = require('express')
const router = express.Router()
const authMiddleware = require("../utils/middleware/authMiddleware")
const deleteNotebooks = require("../utils/middleware/deleteRelatedNotebook")
const deleteCards = require("../utils/middleware/deleteRelatedCards")
const { register,login, deleteAccount, updateProfil, changePassword} = require('../controller/userController')

router.post('/register', register)

router.post('/login', login)

router.delete('/', authMiddleware, deleteCards, deleteNotebooks, deleteAccount)

router.patch('/', authMiddleware, updateProfil)

router.patch('/changePassword',authMiddleware, changePassword)

module.exports = router
