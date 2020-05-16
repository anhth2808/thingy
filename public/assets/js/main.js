'use strict';
var currentQuestion = null;
var playerScore = 0;

var app = {
  admin: () => {
    const socket = io('/game')

    console.log('Start admin views')

    // send message
    $('.send-question-button').click(e => {

      const currentQuestion = $(e.target)

      const sendQuest = {
        _id: currentQuestion.attr('id'),
      }

      socket.emit('question', sendQuest)

      
    })
  },

  game: () =>  {
    const socket = io('/game');
    socket.on('connect', (question) => {
      socket.emit('join', 1);

      
      socket.on('newQuestion', (question) => {
        $('.game-screen ')
          .html(question)
      })

      socket.on('timer', (time) => {
        $('.timer').text(time)
        if (time === 0) {
          $('.timer').text('')
        }        
      })
    })
    // socket.on('update', () => {
    //   socket.on()
    // })
  },

  helpers: {
    
  }
};