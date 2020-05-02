const path = require("path")


exports.getIndex = (req, res, next) => {  
  res.render('./admin/index', {

  })
}

exports.postIndex = (req, res, next) => {  
  console.log(req.body.message)
  res.redirect('/admin')
  
}
