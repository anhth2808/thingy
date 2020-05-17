const Question = require("../models/question")

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

    socket.on('join', (roomId) => {
      socket.join(roomId) 
    })

    // admin send message
    socket.on('question', (sendQuest) => {
      sendQuestion(socket, 1, sendQuest._id)
    })

    socket.on('receiveAnwser', (team) => {
      isReceived = true
      socket.broadcast.to(1).emit('adminAnwser', team);
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