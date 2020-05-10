const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const errorCtrl = require('./app/controllers/error')
const gameRoutes = require('./app/routes')
const adminRoutes = require('./app/routes/admin')

const MONGODB_URI = 'mongodb+srv://lockedheart98:gatigun1@cluster0-y9saz.mongodb.net/CDTN'

const app = express()
const io = require('./app/socket')(app)




app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'app/views'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use(gameRoutes);
app.use('/admin', adminRoutes);
// 
app.get('/500', errorCtrl.get500);
app.use(errorCtrl.get404);
app.use((error, req, res, next) => {
  // res.redirect("/500");
  console.log(error);
  res.status(500).render('500', { 
      pageTitle: 'Error',
      path: "/500"
  });
})


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    io.listen(process.env.PORT || 4444)
  })
  .catch(err => {
    console.log(err)
  })