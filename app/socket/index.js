const Question = require('../models/question')
const Room = require('../models/room')

const QUESTION_APPEAR_TIME = 10
let isReceived = false

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
      sendQuestion(socket, '5ec11f5f68090d33a4287d6b', sendQuest._id)
    })

    socket.on('receiveAnwser', (team) => {
      isReceived = true
      socket.broadcast.to('5ec11f5f68090d33a4287d6b').emit('adminAnwser', team);
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
      socket.emit('newQuestion', question.title);
      socket.broadcast.to(roomId).emit('newQuestion', question.title);
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
    if (timeObj.downTime <= 0 || isReceived === true) {
      isReceived = false
      timeObj.isRun = false

      // stop timer
      clearInterval(intervalId)
      action()
    }
    socket.emit('timer', timeObj);
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