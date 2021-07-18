"use strict"

var express = require("express");

var PublicationController = require("../controllers/publication");
var auth = require("../middleware/auth");

var api = express.Router();
api.post("/publication",auth.ensureAuth,PublicationController.addPublication);
api.get("/publications/:page?",auth.ensureAuth,PublicationController.getPublications);
module.exports = api;
