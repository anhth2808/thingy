const mongoose = require("mongoose");
const User = require('./user')
var DEFAULT_ROUNDS = 5;

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  connections: [{
    user: {type: Object, require: true},
    score: {type: Number, default: 0} 
  }],
  isOpen: { type: Boolean, default: true },
  rounds: { type: Number, default: DEFAULT_ROUNDS },
  currentRound: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})


// user_id
roomSchema.methods.addUserToRoom = function(userId) {
  if (!userId)
    return
    // console.log('connections2: ', this.connections)
  User.findById(userId)
    .then(user => {
      let exits = 1
      console.log('connections: ', this.connections)
      if (this.connections.length > 0) {
        exits = this.connections.filter(connection => {
          if (connection.user._id.toString() === userId)
            console.log('true')
          return connection.user._id.toString() === userId
        }).length

      }
      console.log('exits:', exits)

      if (user && user.admin === false && !exits) {
        this.connections.push({
          user: user,
          score: 0,
        })
        console.log('added')
        return this.save()
      }
    })    
}


module.exports = mongoose.model('Room', roomSchema);