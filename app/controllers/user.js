const path = require("path")
const sendJsonResponse = require('../util/Helper').sendJsonResponse

const User = require("../models/user")


exports.getUserList = (req, res, next) => {
  User.find()
    .then(users => {
      res.render('./admin/user', {
        pageTitle: 'User manager',
        users: users
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postActiveUser = (req, res, next) => {
  const status = req.body.status
  const admin = req.body.admin
  const userId = req.body.userId

  console.log(admin)

  User.findById(userId)
    .then(user => {
      if (status) {
        user.status = 1
      } else {
        user.status = 2
      }
      admin ? user.admin = true : user.admin = false

      user.save()
        .then(result => {
          console.log(result)
        })
        .catch(err => {
          console.log(err)
        })      
      res.redirect('/admin/user')
    })
    .catch(err => {
      console.log(err)
    })
}