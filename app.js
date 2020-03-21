const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")


const MONGODB_URI = "mongodb+srv://lockedheart98:gatigun1@cluster0-y9saz.mongodb.net/CDTN"

const app = express()

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 4444)
  })
  .catch(err => {
    console.log(err)
  })