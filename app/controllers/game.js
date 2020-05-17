const path = require("path")

const Room = require('../models/room')


exports.getRooms = (req, res, next) => {
  Room.find()
  .then(rooms => {
    res.render('./game/room', {
      pageTitle: 'Room list',
      rooms: rooms
    })
  })
}


exports.getIndex = (req, res, next) => {  
  res.render('./game/index', {
  })
}
