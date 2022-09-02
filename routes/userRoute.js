const express = require('express')
const router = express.Router()
const authMiddleware = require("../utils/middleware/authMiddleware")

const { register,login, deleteAccount, updateProfil, changePassword} = require('../controller/userController')

router.post('/register', register)

router.post('/login', login)

router.delete('/', authMiddleware, deleteAccount)

router.patch('/', authMiddleware, updateProfil)

router.patch('/changePassword',authMiddleware, changePassword)

module.exports = router
