const path = require("path")

const Room = require('../models/room')
const user = require("../models/user")


exports.getRooms = (req, res, next) => {
  Room.find()
  .then(rooms => {
    if (req.user.admin)
      return res.redirect('/admin')
    
    res.render('./game/room', {
      pageTitle: 'Room list',
      rooms: rooms
    })
  })
}


exports.getIndex = (req, res, next) => {  
  const roomId = req.params.id

  
  if (roomId) {
    Room.findById(roomId)
    .then(room => {
      res.render('./game/index', {
        room: room,
        user: req.user
      })
    })    
  } else {
    res.redirect("/")
  }
  
}
