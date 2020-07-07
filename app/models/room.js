const mongoose = require("mongoose");
const User = require('./user')
const Question = require('./question')
const Report = require('./report')
const Collection = require('./collection')

var DEFAULT_ROUNDS = 5;

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  currentId: {type: String, default: new Date().toISOString()},
  currentRound: {type: Number, default: 1},
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

roomSchema.methods.newRound = function() {
  this.currentRound++;
  this.rounds.forEach(r => {
    if (r.isCurrentRound) {
      r.isCurrentRound = false      
    }
  })
  Collection.findById("5edfbfc52cf85f6d744665c9")
  .then(collection => {
    this.rounds.push({
      isCurrentRound: true,
      collectionId: collection
    })    
  }).catch()
}

roomSchema.methods.nextRound = function(room) {
  
  Report.find({"roomId": room.currentId})
    .then(reports => {
      if (reports.length) {
        // update report
        const report = reports[0]
        const roundReport = {
          roundNumber: room.currentRound,
          users: room.connections,          
        }
        report.rounds.push(roundReport)
        reports[0].save()
        console.log("REPORT UPDATED: ", report.roomId)

        // update room
        room.currentRound++;
        room.connections.forEach(conc => {
          conc.score = 0;
        })        
        room.rounds.forEach(r => {
          if (r.isCurrentRound) {
            r.isCurrentRound = false      
          }
        })
        Collection.findById("5edfbfc52cf85f6d744665c9")
        .then(collection => {
          room.rounds.push({
            isCurrentRound: true,
            roundNumber: room.currentRound,
            collectionId: collection
          })   
          room.save()
          console.log("ROOM UPDATED: ", room.currentId)
        }).catch()
  
      } else {
        // new report
      }
    })
    .catch()
}

roomSchema.methods.clearRoom = function(room) {
  Report.find({"roomId": room.currentId})
    .then(reports => {
      if (reports.length) {
        // update report
        const report = reports[0]
        const roundReport = {
          roundNumber: room.currentRound,
          users: room.connections,          
        }
        report.rounds.push(roundReport)
        // reports[0].save()
        console.log(report)
        console.log("REPORT UPDATED: ", report.roomId)

        // update room
        room.currentRound = 0;
        room.connections = []  
        room.rounds = []
        room.currentId = new Date().toISOString()
        
        Collection.findById("5edfbfc52cf85f6d744665c9")
        .then(collection => {
          room.rounds.push({
            isCurrentRound: true,
            roundNumber: room.currentRound,
            collectionId: collection
          })   
          // room.save()
          console.log(room)
          console.log("ROOM UPDATED: ", room.currentId)
        }).catch()
  
      } else {
        // new report
      }
    })
    .catch()
}

const newReport = () => {
  User.findById("5ec0eaa8e149c02138ab465a")
  .then(user => {
    let round = {
      roundNumber: 1,
      users: [
        {
          user: user,
          score: 12,
        }
      ]
    }
    const report = new Report({
      roomId: "123",
      rounds: [
        round
      ],
    })
    console.log(report)
    report.save()
      .then((e) => {
        res.redirect("/")
      })
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  }) 
}

module.exports = mongoose.model('Room', roomSchema);