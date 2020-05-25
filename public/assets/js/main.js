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

    // join room
    socket.emit('join', connectInfo);

    // get team anwser
    socket.on('adminAnwser', team => {
      const html = `<tr>
                      <th scope="row">1</th>
                      <td>${team.userName}</td>
                      <td>31s</td>
                    </tr>`
      $('.answer-team tbody')
        .append(html)
    })

    // send message to teams
    // $('.send-question-button').click(e => {
    //   const currentQuestion = $(e.target)
    //   const sendQuest = {
    //     _id: currentQuestion.attr('id'),
    //   }
    //   socket.emit('question', sendQuest)      
    // })

    const socketSendMessageToTeams = () => {
      $('.send-question-button').click(e => {
        const currentQuestion = $(e.target)
        const sendQuest = {
          _id: currentQuestion.attr('id'),
        }
        socket.emit('question', sendQuest)      
      })
    }

    // AJAX Function
    const getCollection = (collectionId) => {
      // const API = HOST + `/collection/${collectionId}`
      const API = HOST + `/collection/5eca411c744ee9671cdea6fb`
      
      fetch(API, {
        method: "GET",
      })
      .then(result => {
        return result.json()
      })
      .then(data => {
        data.questions.forEach(question => {
          app.helpers.showCollectionQuestion(question)
          socketSendMessageToTeams()
        })
      })
      .catch(err => {
        console.log(err)
      });      
    }
    
    // AJAX running function
    getCollection()


    // socket running function
    socketSendMessageToTeams()
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
        const userId = $('.user-id').val()
        const userName = $('.user-name').val()
        const teamInfo = {
          userId: userId,
          userName: userName
        }
        socket.emit('receiveAnwser', teamInfo)
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
    },
    showCollectionQuestion: (question) => {
      const container = $('.collection-container')
      const html = `<div class="col-md-12 ml-auto col-xl-12 mr-auto">
                      <div class="card">
                          <div class="card-body">
                              <div class="tab-content">
                                  <div class="tab-question">
                                    <p></p>
                                    <p></p>
                                    <p></p>
                                    <button id="${question.questionId._id}" class="btn btn-primary ">Chi tiết</button>
                                    <button id="${question.questionId._id}" class="btn btn-primary send-question-button">Gửi câu hỏi</button>                                    
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>`
        container.append(html)      
    }
  }
};