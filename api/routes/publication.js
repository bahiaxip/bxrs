"use strict"

var express = require("express");

var PublicationController = require("../controllers/publication");
var middleware_auth = require("../middleware/auth");

var api = express.Router();
api.post("/publication",middleware_auth.ensureAuth,PublicationController.addPublication);
api.get("/publications",middleware_auth.ensureAuth,PublicationController.getPublications);
module.exports = api;
