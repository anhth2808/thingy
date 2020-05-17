const path = require('path')
const express = require('express')

const isAuth = require("../middleware/is-auth")
const gameCtrl = require('../controllers/game')

const router = express.Router()

router.get('/', isAuth, (req, res, next) => {
  res.redirect('/game')
})
router.get('/game', isAuth, gameCtrl.getIndex)

module.exports = router