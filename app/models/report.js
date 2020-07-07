const mongoose = require("mongoose");
const User = require('./user')

const Schema = mongoose.Schema;

const roundReportSchema = new Schema({
  roundNumber: {type: Number, default: 1},
  users: [{
    user: {type: Object, require: true},
    score: {type: Number, default: 0} 
  }],
})

const reportSchema = new Schema({
  roomId: {type: String},
  roomTitle: {type: String},
  rounds: [roundReportSchema],  
  createdAt: { type: Date, default: Date.now },
})


reportSchema.methods.saveReport = function (params) {
  
}

module.exports = mongoose.model('Report', reportSchema);