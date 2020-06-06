const mongoose = require("mongoose");
const User = require('./user')
const Question = require('./question')
var DEFAULT_ROUNDS = 5;

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  connections: [{
    user: {type: Object, require: true},
    score: {type: Number, default: 0} 
  }],
  isOpen: { type: Boolean, default: true },
  rounds: [{
    roundNumber: {type: Number, default: 1},
    isCurrentRound: {type: Boolean},
    collectionId: {type: Schema.Types.ObjectId, require: true, ref: "Collection"}
  }],
  createdAt: { type: Date, default: Date.now },
}) 


// user_id
roomSchema.methods.addUserToRoom = function(userId) {
  if (!userId)
    return
    // console.log('connections2: ', this.connections)
  User.findById(userId)
    .then(user => {
      let exits = 0
      if (this.connections.length > 0) {
        exits = this.connections.filter(connection => {
          if (connection.user._id.toString() === userId)
            return connection.user._id.toString() === userId
        }).length

      }

      if (user && (user.admin === false) && !exits) {
        this.connections.push({
          user: user,
          score: 0,
        })
        return this.save()
      }
    })    
}

roomSchema.methods.updateUserScore = function(updateInfo, socket) {
  if (!updateInfo.userId)
    return

  const connections = [...this.connections]
  console.log("questionId", updateInfo.questionId)
  Question.findById(updateInfo.questionId)
    .then(question => {
      console.log(question)
      if (question) {
        connections.forEach(con => {
          if (con.user._id.toString() === updateInfo.userId) {            
            console.log(con.score, question.score, "compare")
            con.score += question.score
          }      
        })  
      }
      this.connections = connections
      return this.save()
                .then(result => {
                  socket.emit('updateRanking', this)
                  socket.broadcast.to(this._id).emit('updateRanking', this)
                  console.log('broad cast:', this)
                })   
    })  
}

module.exports = mongoose.model('Room', roomSchema);