const path = require("path")
const sendJsonResponse = require('../util/Helper').sendJsonResponse

const Question = require("../models/question")
const Collection = require("../models/collection")

exports.getQuestions = (req, res, next) => {
  Question.find()
    .then(questions => {
      if (!questions) {
        //
      }
      res.render('./question/index', {
        pageTitle: 'Question list',
        questions: questions
      })

    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getAddQuestion = (req, res, next) => {
  res.render('./question/add-question', {
    pageTitle: 'Thêm câu hỏi',
  });
}

exports.postAddQuestion = (req, res, next) => {
  const title = req.body.title
  const description = req.body.description
  const score = req.body.score
  const answer = req.body.answer

  const question = new Question({
    title: req.body.title,
    description: req.body.description,
    score: req.body.score,
    answer: req.body.answer,
  })

  question.save()
    .then(result => {
      console.log("CREATE QUESTION")
      res.redirect('/admin/question')
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getEditQuestion = (req, res, next) => {
  const questionId = req.params.questionId
  Question.findById(questionId)
    .then(question => {
      if (!question) {
        return res.redirect("/");
      }
      res.render('./question/edit-question', {
        pageTitle: 'Chỉnh sửa câu hỏi',
        question: question
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })

}

exports.postEditQuestion = (req, res, next) => {
  const questionId = req.body.questionId
  const updatedTitle = req.body.title
  const updatedDescription = req.body.description
  const updatedScore = req.body.score
  const updatedAnswer = req.body.answer

  Question.findById(questionId)
    .then(question => {
      question.title = updatedTitle
      question.description = updatedDescription
      question.score = updatedScore
      question.answer = updatedAnswer

      return question.save()
        .then(result => {
          console.log("UPDATED QUESTION!!")
          res.redirect("/admin/question")
        })        
    }) 
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}
