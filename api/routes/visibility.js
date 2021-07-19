"use strict"

var express = require("express");
var VisibilityController = require("../controllers/visibility");
var api = express.Router();
var auth = require("../middleware/auth");
api.post("/visibility",auth.ensureAuth,VisibilityController.onVisibility);
api.get("/visibility/:id",auth.ensureAuth,VisibilityController.getVisibility);
module.exports = api;
