


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

      socket.join(roomId);
      sendQuestion(socket, roomId)      
    })

    // admin send message
    socket.on('question', (msg) => {
      console.log(msg)
      if ( msg == 1) {
        sendQuestion(socket, 1)
      }
    })

    //io.to('1').emit('newQuestion', 'hello');


    socket.on('disconnect', () => {
      console.log('User disconected')
    })
  })


}

const sendQuestion = (socket, roomId) => {
  let question = {
    question: "Question 5 ?",
    answer: "D",
    options: [{ val: "A", text: "option A" },
      { val: "B", text: "option B" },
      { val: "C", text: "option C" },
      { val: "D", text: "option D" }
    ]
  }
  socket.emit('newQuestion', question);
  socket.broadcast.to(roomId).emit('newQuestion', question);
}


const init = (app) => {
  const server = require('http').Server(app);
  const io = require('socket.io')(server);

  socketio(io);
  console.log('server run')
  return server;
}


module.exports = init;