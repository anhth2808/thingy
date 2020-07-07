const path = require("path")
const sendJsonResponse = require('../util/Helper').sendJsonResponse

const Report = require("../models/report")
const User = require("../models/user")


exports.getReports = (req, res, next) => {
  Report.find()
    .then(reports => {
      if (!reports) {
        //
      }
      console.log(reports)
      res.render('./report/index', {
        pageTitle: 'Reports List',
        reports: reports
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getReport = (req, res, next) => {
  const reportId = req.params.reportId
  Report.findById(reportId)
    .then(report => {
      if (!report) {
        //
      }
      console.log(report)
      res.render('./report/report-detail', {
        pageTitle: 'Report detail',
        report: report
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postAddReport = (req, res, next) => {
  User.findById("5ec0eaa8e149c02138ab465a")
    .then(user => {
      let round = {
        roundNumber: 1,
        users: [
          {
            user: user,
            score: 12,
          }
        ]
      }
      const report = new Report({
        roomId: "123",
        rounds: [
          round
        ],
      })
      console.log(report)
      report.save()
        .then((e) => {
          res.redirect("/")
        })
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