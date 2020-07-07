const Question = require('../models/question')
const Room = require('../models/room')

const DEFAULT_ROOM_ID = '5ec11f5f68090d33a4287d6b'
const QUESTION_APPEAR_TIME = 5
let IS_RECEIVED =  false

const socketio = (io) => {

  io.of('/room').on('connection', (socket) => {
    console.log('User is connected')

    socket.on('chat message', (msg) => {
      console.log(msg)
      socket.broadcast.emit('hi')
    })

    socket.on('disconnect', () => {
      console.log('User disconected')
    })
  })

  io.of('/game').on('connection', (socket) => {
    console.log('User is connected to game')

    socket.on('join', (connectInfo) => {
      socket.join(connectInfo.roomId)
      Room.findById(connectInfo.roomId)
        .then(room => {
          if (!room) {
            console.log("room not found")
            return
          }
          room.addUserToRoom(connectInfo.userId)
        })
    })

    // admin send message
    socket.on('question', (sendQuest) => {
      IS_RECEIVED = false
      sendQuestion(socket, DEFAULT_ROOM_ID, sendQuest._id)
    })

    socket.on('receiveAnwser', (teamInfo) => {
      IS_RECEIVED = true
      socket.broadcast.to(DEFAULT_ROOM_ID).emit('adminAnwser', teamInfo);
    })

    socket.on('updateTeamScore', (updateInfo) => {
      Room.findById(DEFAULT_ROOM_ID)
        .then(room => {
          room.updateUserScore(updateInfo, socket)
        })
    })

    socket.on('nextRoundOn', () => {
      Room.findById(DEFAULT_ROOM_ID)
        .then(room => {
          room.nextRound(room)
        })
    })
    
    socket.on('disconnect', () => {
      console.log('User disconected')
    })
  })


}

const sendQuestion = (socket, roomId, questionId) => {
  Question.findById(questionId)
  .then(question => {
    timer(socket, roomId, QUESTION_APPEAR_TIME, () => {
      // socket.emit('newQuestion', question.title);
      socket.broadcast.to(roomId).emit('newQuestion', question);
    })
  })
}

const timer = (socket, roomId, time, action) => {
  let intervalId = null
  let timeObj = {
    downTime: time,
    isRun: true
  }
  const intervalFunc = () => {
    timeObj.downTime -= 1
    if (timeObj.downTime <= 0 || IS_RECEIVED === true) {
      IS_RECEIVED = false
      timeObj.isRun = false

      // stop timer & send question
      clearInterval(intervalId)
      action()
    }
    // socket.emit('timer', timeObj);
    socket.broadcast.to(roomId).emit('timer', timeObj);
  }

  intervalId = setInterval(intervalFunc, 1000);
}

const init = (app) => {
  const server = require('http').Server(app);
  const io = require('socket.io')(server);

  socketio(io);
  console.log('server run')
  return server;
}


module.exports = init;