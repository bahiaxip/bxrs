"use strict"

var express=require("express");
var MessageController = require("../controllers/message");
var auth = require("../middleware/auth");
var api=express.Router();

api.post("/message",auth.ensureAuth,MessageController.saveMessage);
api.get("/received-messages/:page?",auth.ensureAuth,MessageController.getReceivedMessages);
api.get("/sended-messages/:page?",auth.ensureAuth,MessageController.getEmmittedMessages);
module.exports=api;
