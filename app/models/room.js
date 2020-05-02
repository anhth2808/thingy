const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Room', roomSchema);