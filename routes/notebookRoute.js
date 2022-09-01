const express = require('express')
const router = express.Router()
const {createNotebook, getNotebooks, deleteNoteBook} = require("../controller/notebookController")
const authMiddleware = require("../utils/middleware/authMiddleware")

router.post("/", authMiddleware, createNotebook)

router.get("/", authMiddleware ,getNotebooks)

router.delete("/:notebookId",authMiddleware, deleteNoteBook)

module.exports= router