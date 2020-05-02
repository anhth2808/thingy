'use strict';
var currentQuestion = null;
var playerScore = 0;

var app = {
  admin: () => {
    const socket = io('/game')

    console.log('Start admin views')
    let value =  $('#m')
    
    $('#submit').click(e => {
      e.preventDefault();
      socket.emit('question', value.val())

    })
  },

  game: () =>  {
    const socket = io('/game');
    socket.on('connect', (question) => {
      socket.emit('join', 1);

      
      socket.on('newQuestion', (question) => {
        console.log(question)
      })
    })
    // socket.on('update', () => {
    //   socket.on()
    // })
  },

  helpers: {
    
  }
};