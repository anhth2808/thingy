const path = require('path')
const express = require('express')

const isAdmin = require("../middleware/is-admin")
const adminCtrl = require('../controllers/admin')
const collectionCtrl = require('../controllers/collection')

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

// collection api
router.get('/collection', collectionCtrl.collectionList)

router.get('/collection/:collectionid', collectionCtrl.collectionReadOne)

router.post('/collection', collectionCtrl.collectionCreate)


module.exports = router