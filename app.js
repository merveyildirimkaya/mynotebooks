const express = require('express')
const app = express()
const db= require('./utils/db/dbConnection')
const userRoute=require('./routes/userRoute')
const notebookRoute=require('./routes/notebookRoute')
const cardRoute = require('./routes/cardRoute')
const errorHandler = require("./utils/middleware/errorHandling")

db()


app.use(express.json())
app.use('/user',userRoute)
app.use('/notebooks',notebookRoute)
app.use('/cards',cardRoute)

app.use(errorHandler)

module.exports = app


