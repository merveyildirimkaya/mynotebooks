const express = require('express')
const router = express.Router()
const deleteRelatedCards = require("../utils/middleware/deleteRelatedCards")
const {createNotebook, getNotebooks, deleteNoteBook} = require("../controller/notebookController")
const authMiddleware = require("../utils/middleware/authMiddleware")
const authforNotebooks = require("../utils/middleware/authForNotebooks")

router.post("/", authMiddleware, createNotebook)

router.get("/", authMiddleware ,getNotebooks)

router.delete("/:notebookId",authMiddleware, authforNotebooks,deleteRelatedCards, deleteNoteBook)

module.exports= router