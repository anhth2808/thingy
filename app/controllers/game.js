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
  const roomId = req.params.id

  res.render('./game/index', {
    roomId: roomId,
    user: req.user
  })
}
