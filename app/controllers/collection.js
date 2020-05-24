const path = require("path")
const sendJsonResponse = require('../util/Helper').sendJsonResponse

const Question = require("../models/question")
const Collection = require("../models/collection")




exports.collectionList = (req, res, next) => {
  Collection.find()
    .populate('questions.questionId', 'time')
    .select()
    .then(collections => {
      if (!collections) {
        sendJsonResponse(res, 404, {
          "message": "Not found"
        })
        return
      }
      sendJsonResponse(res, 200, collections)
    })
    .catch(err => {
      const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

exports.collectionReadOne = (req, res, next) => {
  const collectionid = req.params.collectionid
  
  Collection.findById(collectionid)
    .populate('questions.questionId')
    .then(collection => {
      if (!collection) {
        sendJsonResponse(res, 404, {
          "message": "Not found"
        })
        return
      }
      sendJsonResponse(res, 200, collection)
    })
    .catch(err => {
      const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}


exports.collectionCreate = (req, res, next) => { 
  const title = req.body.title
  const collection = new Collection({   
    title: title,
    questions: [],
  })

  collection.save()
    .then(result => {
      sendJsonResponse(res, 201, {message: result})
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })  
}