const express = require('express')
const router = express.Router()
const languages = require('../controller/languageController')

router.get("/", languages.getAllLanguages)

module.exports = router