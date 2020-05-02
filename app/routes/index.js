const path = require('path')
const express = require('express')

const gameCtrl = require('../controllers/game')

const router = express.Router()

router.get('/game', gameCtrl.getIndex)

module.exports = router