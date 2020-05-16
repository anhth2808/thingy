const Question = require("../models/question")


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

    socket.on('disconnect', () => {
      console.log('User disconected')
    })
  })


}

const sendQuestion = (socket, roomId, questionId) => {
  Question.findById(questionId)
  .then(question => {
    timer(socket, roomId, question.time, () => {
      socket.emit('newQuestion', question.title);
      socket.broadcast.to(roomId).emit('newQuestion', question.title);
    })
  })
}

const timer = (socket, roomId, time, action) => {
  let intervalId = null
  const intervalFunc = () => {
    time = time - 1
    socket.emit('timer', time);
    socket.broadcast.to(roomId).emit('timer', time);

    if (time <= 0) {
      clearInterval(intervalId)
      action()
    }
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