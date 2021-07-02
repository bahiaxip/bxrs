"use strict"

var express = require("express");

var PublicationController = require("../controllers/publication");

var api = express.Router();
api.post("/publication",PublicationController.addPublication);

module.exports = api;
