const path = require("path")
const sendJsonResponse = require('../util/Helper').sendJsonResponse

const Question = require("../models/question")
const Collection = require("../models/collection")
const Room = require("../models/room")



exports.getIndex = (req, res, next) => {
  Room.findById('5ec11f5f68090d33a4287d6b')
    // .populate('rounds.collectionId')
    .populate({
      path: 'rounds.collectionId',
      model: 'Collection',
      populate: {
        path: 'questions.questionId',
        model: 'Question'
      }
    })
    .then(room => {        
      // console.log(room)
      console.log(room.rounds[0].collectionId.questions[0].questionId)
      res.render('./admin/index', {
        pageTitle: 'Admin page',
        room: room,
        user: req.user
      })
    })
}

exports.postIndex = (req, res, next) => {  
  console.log(req.body.message)
  res.redirect('/admin')
  
}


// ----------------------------API------------------------------------

// Quesiton api
exports.questionList = (req, res, next) => {
  Question.find()
  .then(questions => {
    if (!questions) {
      sendJsonResponse(res, 404, {
        "message": "Not found"
      })
      return
    }
    sendJsonResponse(res, 200, questions)
  })
  .catch(err => {
    const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
  })
}

exports.quesitonReadOne = (req, res, next) => {
  const id = req.params.questionid
  Question.findById(id)
    .then(question => {
      if (!question) {
        sendJsonResponse(res, 404, {
          "message": "Not found"
        })
        return
      }
      sendJsonResponse(res, 200, question)
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500
      return next(error)
    });
}

exports.questionCreate = (req, res, next) => { 
  const title = req.body.title
  const type = req.body.type
  const description = req.body.description
  const time = req.body.time || null
  const answer = req.body.answer
  
  const question = new Question({
    title: title,
    type: type,
    description: description,
    time: time,
    answer: answer,
  })

  question.save()
    .then(result => {
      sendJsonResponse(res, 201, {message: 'hello'})
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })

  
}

exports.questionUpdateOne = (req, res, next) => {

  Question.findById(req.params.questionid)
    .then(question => {
      if (!question) {
        sendJsonResponse(res, 404, {
          "message": "Not found"
        })
        return
      }
      question.title = req.body.title
      question.type = req.body.type
      question.description = req.body.description
      question.time = req.body.time
      question.answer = req.body.answer

      question.save()
        .then(result => {
          sendJsonResponse(res, 200, question);
        })
        .catch(err => {
          const error = new Error(err)
          error.httpStatusCode = 500
          return next(error)
        })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.questionDeleteOne = (req, res, next) => {
  const questionId = req.params.questionid

  Question.findById(questionId)
    .then(question => {
      if (!question) {
        sendJsonResponse(res, 404, {
          "message": "Not found"
        })
        return
      }
      Question.deleteOne({
        _id: questionId        
      })
      .then(() => {
        sendJsonResponse(res, 204, null);
      })
      .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })

}

// Room api
exports.roomList = (req, res, next) => {
  Room.find()
    .then(rooms => {
      if (!rooms) {
        sendJsonResponse(res, 404, {
          "message": "Not found"
        })
        return
      }
      sendJsonResponse(res, 200, rooms)
    })
    .catch(err => {
      const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

exports.roomCreate = (req, res, next) => {   
  const title = req.body.title

  const room = new Room({
    title: title,
    rounds: []
  })

  room.save()
    .then(result => {
      sendJsonResponse(res, 201, {message: 'hello'})
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
  
}