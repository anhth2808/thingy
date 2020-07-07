const mongoose = require("mongoose");
const User = require('./user')
const Question = require('./question')
const Report = require('./report')
const Collection = require('./collection')

var DEFAULT_ROUNDS = 5;
var DEFAULT_COLLECTION = "5edfbfc52cf85f6d744665c9";
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
  Collection.findById(DEFAULT_COLLECTION)
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
          .then(result => {
            console.log("REPORT UPDATED: ", report.roomId)
          })        

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
        Collection.findById(DEFAULT_COLLECTION)
        .then(collection => {
          room.rounds.push({
            isCurrentRound: true,
            roundNumber: room.currentRound,
            collectionId: collection
          })   
          room.save()
            .then(result => {
              console.log("ROOM UPDATED: ", room.currentId)
            })          
        }).catch()
  
      } else {
        // new report
        console.log("run here")
        const roundReport = {
          roundNumber: room.currentRound,
          users: room.connections,          
        }
        const report = new Report({
          roomId: room.currentId,
          roomTitle: room.title,
          rounds: [
            roundReport
          ]
        })
        report.save()
          .then(result => {
            console.log("REPORT CREATED: ", report.roomId)
          })
        

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
        Collection.findById(DEFAULT_COLLECTION)
        .then(collection => {
          room.rounds.push({
            isCurrentRound: true,
            roundNumber: room.currentRound,
            collectionId: collection
          })   
          room.save()
            .then(result => {
              console.log("ROOM UPDATED: ", room.currentId)
            })          
        }).catch()
  
      }
    })
    .catch()
}

roomSchema.methods.clearRoom = function(room, socket) {
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
          .then(result => {
            console.log("REPORT UPDATED: ", report.roomId)
          })
        console.log(report)
        

        // update room
        room.currentRound = 0;
        room.connections = []  
        room.rounds = []
        room.currentId = new Date().toISOString()

        Collection.findById(DEFAULT_COLLECTION)
        .then(collection => {
          room.rounds.push({
            isCurrentRound: true,
            roundNumber: room.currentRound,
            collectionId: collection
          })   
          room.save()
            .then(result => {
              console.log("ROOM UPDATED: ", room.currentId)
            })
        }).catch()
  
      } else {
        // new report
        console.log("run here")
        const roundReport = {
          roundNumber: room.currentRound,
          users: room.connections,          
        }
        const report = new Report({
          roomId: room.currentId,
          roomTitle: room.title,
          rounds: [
            roundReport
          ]
        })
        report.save()
          .then(result => {
            console.log("REPORT CREATED: ", report.roomId)
            socket.emit('sendReportURL', report._id)
            socket.broadcast.to(room._id).emit('sendReportURL', report._id);          
          })
        

        // update room
        room.currentRound = 0;
        room.connections = []  
        room.rounds = []
        room.currentId = new Date().toISOString()

        Collection.findById(DEFAULT_COLLECTION)
        .then(collection => {
          room.rounds.push({
            isCurrentRound: true,
            roundNumber: room.currentRound,
            collectionId: collection
          })   
          room.save()
            .then(result => {
              console.log("ROOM UPDATED: ", room.currentId)
            })          
        }).catch()
      }
    })
    .catch()
}


module.exports = mongoose.model('Room', roomSchema);