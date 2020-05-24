const mongoose = require("mongoose");
const Question = require('./question')


const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  title: {type: String, required: true},
  questions: [{
    questionId: {type: Schema.Types.ObjectId, require: true, ref: "Question"}
  }]
})


collectionSchema.methods.addQuestionToCollection = function(questionId) {
  if (!questionId)
    return
  Question.findById(questionId)
    .then(question => {
      if (question) {
        this.questions.push({
          questionId: question
        })
      }
    })
    .catch(e => {
      console.log(e)
    })    
}

module.exports = mongoose.model('Collection', collectionSchema);