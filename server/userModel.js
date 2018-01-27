const mongoose = require("mongoose");
var x = 5;
let User = mongoose.model(`User`, {
  username: {
    type: String,
    required: true,
    minlength: 4
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = {
  User
}
