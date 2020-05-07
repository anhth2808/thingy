const path = require('path')
const express = require('express')

const adminCtrl = require('../controllers/admin')

const router = express.Router()

router.get('/', adminCtrl.getIndex)

router.post('/', adminCtrl.postIndex)


router.get('/create', adminCtrl.postAddQuestion)

module.exports = router