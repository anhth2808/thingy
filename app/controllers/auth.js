const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator/check");


const User = require("../models/user")


exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("./auth/login", {
    pageTitle: "Đăng nhập hệ thống",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .render("./auth/login", {
        pageTitle: "Đăng nhập hệ thống",
        path: "/login",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: errors.array()
      });
  }


  User.findOne({
      email: email,
    })
    .then(user => {
      if (user.status === 1) {
        return user
      }
      return res.status(422)
        .render("./auth/login", {
          pageTitle: "Đăng nhập hệ thống",
          path: "/login",
          errorMessage: "Tài khoản chưa được kích hoạt, yêu cầu admin để được kích hoạt.",
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        })
    })
    .then(user => {
      if (!user) {
        return res.status(422)
          .render("./auth/login", {
            pageTitle: "Đăng nhập hệ thống",
            path: "/login",
            errorMessage: "Email hoặc mật khẩu không hợp lệ.",
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          })
      }

      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user

            if (user.admin === true) {
              req.session.isAdmin = true;
              return req.session.save((err) => {
                if (err) {
                  console.log(err)
                }
                res.redirect("/admin");
              });
            }

            return req.session.save((err) => {
              if (err) {
                console.log(err)
              }
              res.redirect("/");
            });
          }
          return res.status(422)
            .render("./auth/login", {
              pageTitle: "Đăng nhập hệ thống",
              path: "/login",
              errorMessage: "Email hoặc mật khẩu không hợp lệ.",
              oldInput: {
                email: email,
                password: password
              },
              validationErrors: []
            });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("./auth/signup", {
    pageTitle: "Đăng ký tài khoản",
    path: "/signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: []
  });
}


exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("./auth/signup", {
      pageTitle: "Đăng ký tài khoản",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }


  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/')
    })    
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}



exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  })
}
