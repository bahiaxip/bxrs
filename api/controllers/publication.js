"use strict"

var moment = require("moment");
var Publication = require("../models/publication");
var User = require("../models/user");


var controller = {
  addPublication: function(req,res){
    var params = req.body;

    if(!params.text)
      return res.status(200).send({message: "Text not exist"});
    var publication = new Publication();
    console.log(req.body)
    publication.text = params.text;
    publication.file="null";
    publication.user = req.user._id;
    publication.created_at = moment().unix();
    publication.save((err,publicationStored) => {
      if(err)
        return res.status(404).send({message: "error storing publication"});
      if(!publicationStored)
        return res.status(404).send({message: "publication hasn't been stored"})
      return res.status(200).send({publication:publicationStored});
    })
}

}
module.exports = controller;
