const mongoose = require("mongoose");

var DEFAULT_ROUNDS = 5;

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  connections: { type: [{ userId: String, socketId: String }] },
  isOpen: { type: Boolean, default: true },
  rounds: { type: Number, default: DEFAULT_ROUNDS },
  currentRound: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Room', roomSchema);