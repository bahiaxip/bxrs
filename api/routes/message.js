"use strict"

var express=require("express");
var MessageController = require("../controllers/message");
var auth = require("../middleware/auth");
var api=express.Router();

api.post("/message",auth.ensureAuth,MessageController.saveMessage);
module.exports=api;
