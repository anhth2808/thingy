const path = require('path')
const express = require('express')

const isAdmin = require("../middleware/is-admin")
const adminCtrl = require('../controllers/admin')

const router = express.Router()

router.get('/', isAdmin, adminCtrl.getIndex)

router.post('/', isAdmin, adminCtrl.postIndex)


//  question api
router.get('/question', adminCtrl.questionList)

router.get('/question/:questionid', adminCtrl.quesitonReadOne)

router.post('/question', adminCtrl.questionCreate)

router.put('/api/question/:questionid', adminCtrl.questionUpdateOne)

router.delete('/api/question/:questionid', adminCtrl.questionDeleteOne)

//  room api
router.get('/room', adminCtrl.roomList)

router.post('/room', adminCtrl.roomCreate)



module.exports = router