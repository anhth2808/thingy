const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: {type: String, required: true},
  type: {type: String},
  description: {type: String},
  time: {type: Number, default: 15},
  answer: { type: String},
  score: { type: Number, default: 0},
  // options: { type: [{ val: String, text: String, _id: { id: false } }] },
  createdAt: { type: Date, default: Date.now },
})





module.exports = mongoose.model('Question', questionSchema  );