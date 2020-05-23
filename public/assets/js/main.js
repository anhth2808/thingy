'use strict';
var currentQuestion = null;
var playerScore = 0;

const HOST = window.location.origin + '/admin'

var app = {
  admin: () => {
    const socket = io('/game')

    const userId = $('.user-id').val()
    
    const connectInfo = {
      roomId: '5ec11f5f68090d33a4287d6b',
      userId: userId
    }

    socket.emit('join', connectInfo);



    socket.on('adminAnwser', team => {
      console.log(team)
    })

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
      const roomId = $('.room-id').val()
      const userId = $('.user-id').val()

      const connectInfo = {
        roomId: roomId,
        userId: userId
      }

      console.log(roomId)
      socket.emit('join', connectInfo)
      
      socket.on('newQuestion', (question) => {
        $('.game-screen ')
          .html(question)
        
      })
      
      socket.on('timer', (timeObj) => {        
        $('.timer').text(timeObj.downTime)
        $('.submit-awswer button').addClass('d-none') 

        if (timeObj.downTime === 0 || timeObj.isRun === false) {
          $('.timer').text('')
          $('.submit-awswer button').removeClass('d-none') 
        }
      })

      $('.submit-awswer button').click(() => {
        socket.emit('receiveAnwser', 'Đội a')
        $('.submit-awswer button').addClass('d-none') 
      })

    })
  },

  room: () =>  {
    const getRoomList = () => {
      const roomListAPI = HOST + '/room'      
      
      fetch(roomListAPI, {
        method: "GET",
        // headers: {
        //     "csrf-token": csrf
        // }
      })
      .then(result => {
        return result.json()
      })
      .then(data => {
        data.forEach(room => {
          app.helpers.showRoom(room)
        })
      })
      .catch(err => {
          console.log(err);
      });      
    }

  },

  helpers: {
    showRoom: (room) => {
      const tabRoom = $('.tab-room')
      const html = `<div class="col-md-12 ml-auto col-xl-12 mr-auto">
                      <div class="card">
                        <div class="card-body">
                          <div class="tab-content">
                            <div class="tab-room">
                              <p>room title</p><button class="btn btn-primary">Tham gia</button></div>
                            </div>
                          </div>
                      </div>
                    </div>`
      tabRoom.append(html)
    }
  }
};