const express = require('express')
const app = express()
const db= require('./src/utils/db/dbConnection')
const userRoute=require('./src/routes/userRoute')
const notebookRoute=require('./src/routes/notebookRoute')
const cardRoute = require('./src/routes/cardRoute')
const languageRoute = require('./src/routes/languageRoute')
const errorHandler = require("./src/utils/middleware/errorHandling")

const flash = require('connect-flash')

const session = require('express-session')

//template engine ayarlari
const ejs= require('ejs');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path')

app.use(expressEjsLayouts)
app.use(express.static('public'))
app.use("/uploads",express.static(path.join(__dirname,'/src/uploads')))
app.set('view engine', 'ejs')
app.set('views',path.resolve(__dirname,'./src/views'))




app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
}
))

db.connectDatabase()


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(flash());

app.use((req,res,next)=>{
    res.locals.validation_error = req.flash('validation_error')
    res.locals.success_message = req.flash('success_message')
    res.locals.firstname = req.flash('firstname')
    res.locals.lastname = req.flash('lastname')
    res.locals.emailadress = req.flash('emailadress')
    res.locals.password = req.flash('password')
    res.locals.repeatpassword = req.flash('repeatpassword')

    res.locals.login_error = req.flash('error')
    next()
})

app.use('/user',userRoute)
app.use('/notebooks',notebookRoute)
app.use('/cards',cardRoute)
app.use('/languages',languageRoute)


app.use(errorHandler)

module.exports = app


