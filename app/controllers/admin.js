const path = require("path")

const Question = require("../models/question")

exports.getIndex = (req, res, next) => {  
  Question.find()
  .then(questions => {
    res.render('./admin/index', {
      pageTitle: 'Admin page',
      questions: questions
    })
  })


}

exports.postIndex = (req, res, next) => {  
  console.log(req.body.message)
  res.redirect('/admin')
  
}

exports.postAddQuestion = (req, res, next) => {  
  const question = new Question({
    title: 'Sao Hỏa có hình gì ?',
    type: 'Thiên văn',
    description: 'Sao hỏa nhìn thật là to',
    time: 15,
    answer: 'Tròn',
  })

  question.save()
    .then(result => {
      console.log("Create Question")
      res.redirect("/")
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
