const path = require('path')
const express = require('express')

const adminCtrl = require('../controllers/admin')

const router = express.Router()

router.get('/', adminCtrl.getIndex)

router.post('/', adminCtrl.postIndex)


//  question api
router.get('/question', adminCtrl.questionList)

router.get('/question/:questionid', adminCtrl.quesitonReadOne)

router.post('/question', adminCtrl.questionCreate)

router.put('/api/question/:questionid', adminCtrl.questionUpdateOne)

router.delete('/api/question/:questionid', adminCtrl.questionDeleteOne)


module.exports = router