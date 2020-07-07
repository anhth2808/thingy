const path = require('path')
const express = require('express')

const isAdmin = require("../middleware/is-admin")
const adminCtrl = require('../controllers/admin')
const collectionCtrl = require('../controllers/collection')
const questionCtrl = require('../controllers/question')
const userCtrl = require('../controllers/user')
const reportCtrl = require('../controllers/report')

const router = express.Router()

router.get('/', isAdmin, adminCtrl.getIndex)

router.post('/', isAdmin, adminCtrl.postIndex)


// user manager
router.get('/user', isAdmin, userCtrl.getUserList)

router.post('/user/active', isAdmin, userCtrl.postActiveUser)

// question manager
router.get('/question', isAdmin, questionCtrl.getQuestions)

router.get('/add-question', isAdmin, questionCtrl.getAddQuestion)

router.post('/add-question', isAdmin, questionCtrl.postAddQuestion)


router.get('/edit-question/:questionId', isAdmin, questionCtrl.getEditQuestion)

router.post('/edit-question', isAdmin, questionCtrl.postEditQuestion)

// ===================== API =================================

//  question api
router.get('/api/question', adminCtrl.questionList)

router.get('/api/question/:questionid', adminCtrl.quesitonReadOne)

router.post('/api/question', adminCtrl.questionCreate)

router.put('/api/question/:questionid', adminCtrl.questionUpdateOne)

router.delete('/api/question/:questionid', adminCtrl.questionDeleteOne)

//  room api
router.get('/room', adminCtrl.roomList)

router.post('/room', adminCtrl.roomCreate)

router.get('/room/:roomid/changecollection/:collectionid', adminCtrl.roomChangeCollection)

// collection api
router.get('/collection', collectionCtrl.collectionList)

router.get('/collection/:collectionid', collectionCtrl.collectionReadOne)

router.post('/collection', collectionCtrl.collectionCreate)

router.post('/collection/:collectionid', collectionCtrl.collectionUpdateOne)

router.get('/collection/:collectionid/remove/:questionid', collectionCtrl.collectionRemoveQuestion)


// report api

router.get('/report', reportCtrl.getReports)

router.get('/report/:reportId', reportCtrl.getReport)

module.exports = router