const express = require("express");
const {check, body} = require("express-validator/check")
const User = require('../models/user')

const authCtrl = require("../controllers/auth")

const router = express.Router()

router.get("/login", authCtrl.getLogin)
router.post("/login", 
  [
    check("email")
      .isEmail()
      .withMessage("Vui lòng nhập email hợp lệ.")
      .normalizeEmail(),
    body("password", "Vui lòng nhập mật khẩu chỉ có số và văn bản và ít nhất 5 ký tự.")
      .isLength({min: 5})
      .isAlphanumeric()
      .trim()     
  ],
  authCtrl.postLogin
);

router.get("/signup", authCtrl.getSignup);

router.post('/signup', 
  [
    check("email")
      .isEmail()
      .withMessage("Vui lòng nhập email hợp lệ.")
      .custom((value, {req}) => {
        return User.findOne({email: value})
          .then(userDoc => {
            if (userDoc) {
                // return reject to return as an error message
                return Promise.reject("Email đã tồn tại, vui lòng chọn một email khác.");
            }
          });                    
      })
      .normalizeEmail(),
    /*
        just check password at body, dont care header or any where
    */
    body("password", "Vui lòng nhập mật khẩu chỉ có số và văn bản và ít nhất 5 ký tự.")
      .isLength({min: 5})
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, {req}) => {
      if (value !== req.body.password) {
          throw new Error("Mật khẩu phải phù hợp!");
      }
      return true;
    })
    .trim()
  ], 
  authCtrl.postSignup
);

router.post("/logout", authCtrl.postLogout);

module.exports = router;