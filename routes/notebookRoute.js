const express = require('express')
const router = express.Router()
const deleteRelatedCards = require("../utils/middleware/deleteCards")
const {createNotebook, getNotebooks, deleteNoteBook} = require("../controller/notebookController")
const authMiddleware = require("../utils/middleware/authMiddleware")
const accessforNotebooks = require("../utils/middleware/accesForNotebooks")

router.post("/", authMiddleware, createNotebook)

router.get("/", authMiddleware ,getNotebooks)

router.delete("/:notebookId",authMiddleware, accessforNotebooks,deleteRelatedCards, deleteNoteBook)

module.exports= router