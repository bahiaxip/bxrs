"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
  //id: String,
  name: String,
  nick: String,
  email: {
    type: String,
    required: true
  },
  password: String,
  role:String,
  image: String
});

module.exports = mongoose.model("User", UserSchema);
