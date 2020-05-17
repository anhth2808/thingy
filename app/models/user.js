const mongoose = require("mongoose")
const Schema = mongoose.Schema

// status: 2(not active), 1(actived)


const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: { type: Boolean, default: false },
  status: {
    type: Number,
    default: 2
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);