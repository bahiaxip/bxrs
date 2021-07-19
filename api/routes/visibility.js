"use strict"

var express = require("express");
var VisibilityController = require("../controllers/visibility");
var api = express.Router();
var auth = require("../middleware/auth");
api.post("/visibility",auth.ensureAuth,VisibilityController.onVisibility);

module.exports = api;
