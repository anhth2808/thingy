const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {type: String, required: true},
  answer: { type: String, required: true },
  options: { type: [{ val: String, text: String, _id: { id: false } }] },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Question', questionSchema  );