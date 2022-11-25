const express = require('express')
const router = express.Router()
const authMiddleware = require("../utils/middleware/authMiddleware")
const deleteNotebooks = require("../utils/middleware/deleteRelatedNotebook")
const deleteCards = require("../utils/middleware/deleteRelatedCards")
const { register,login, deleteAccount, updateProfil, 
    changePassword,getUser, verifyEmail,resetPasswordForm,resetPassword,
    forgotPassword,uploadPhoto, getUploadedPhoto
} = require('../controller/userController')

const validationMiddleware = require('../utils/middleware/validationMiddleware')

const multerConfig = require('../config/multer_config')

router.post('/register', register)

router.post('/login', login)

router.get('/verify', verifyEmail)

router.post('/forgot-password', forgotPassword)

router.get('/reset-password/:_id/:token', resetPasswordForm)

router.post('/reset-password',  validationMiddleware.validateNewPass(), resetPassword)

router.get('/reset-password', resetPasswordForm)

router.get('/',authMiddleware,getUser)

router.delete('/', authMiddleware, deleteCards, deleteNotebooks, deleteAccount)

router.patch('/', authMiddleware, updateProfil)

router.post('/avatar', authMiddleware, multerConfig.single('avatar'), uploadPhoto)

router.get('/avatar', authMiddleware, getUploadedPhoto)

router.patch('/changePassword',authMiddleware, changePassword)

module.exports = router
