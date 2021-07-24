"use strict"

var express = require("express");

var PublicationController = require("../controllers/publication");
var auth = require("../middleware/auth");

var api = express.Router();
api.post("/publication",auth.ensureAuth,PublicationController.addPublication);
api.put("/publication/:id",auth.ensureAuth,PublicationController.updatePublication);
api.get("/publications/:page?",auth.ensureAuth,PublicationController.getPublications);
api.delete("/publication/:id",auth.ensureAuth,PublicationController.deletePublication);
module.exports = api;
