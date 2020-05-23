const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require("express-session")
const mongoose = require('mongoose')
const MongoDBStore = require("connect-mongodb-session")(session)
const flash = require("connect-flash")
const csrf = require("csurf")
const User = require('./app/models/user')

const errorCtrl = require('./app/controllers/error')
const gameRoutes = require('./app/routes')
const adminRoutes = require('./app/routes/admin')
const authRoutes = require("./app/routes/auth")


const MONGODB_URI = 'mongodb+srv://lockedheart98:gatigun1@cluster0-y9saz.mongodb.net/CDTN'

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session"
})

const io = require('./app/socket')(app)




app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'app/views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
app.use(
  session({ secret: "a long string", resave: false, saveUninitialized: false, store: store })
)
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next()
      }
      req.user = user
      next()
    })
    .catch(err => {
      next(new Error(err))
    })
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.isAdmin = req.session.isAdmin
  next()
})

app.use(gameRoutes)
app.use('/admin', adminRoutes)
app.use(authRoutes)
// 
app.get('/500', errorCtrl.get500)
app.use(errorCtrl.get404)
app.use((error, req, res, next) => {
  // res.redirect("/500")
  console.log(error)
  res.status(500).render('500', { 
      pageTitle: 'Error',
      path: "/500"
  })
})


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    io.listen(process.env.PORT || 4444)
  })
  .catch(err => {
    console.log(err)
  })