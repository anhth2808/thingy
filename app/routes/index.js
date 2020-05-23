const path = require('path')
const express = require('express')

const isAuth = require("../middleware/is-auth")
const gameCtrl = require('../controllers/game')

const router = express.Router()

router.get('/', isAuth, gameCtrl.getRooms)
router.get('/game', isAuth, gameCtrl.getIndex)
router.get('/game/:id', isAuth, gameCtrl.getIndex)

module.exports = router