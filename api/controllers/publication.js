"use strict"

var moment = require("moment");
var Publication = require("../models/publication");
var User = require("../models/user");
var Follow=require("../models/follow");

var controller = {
  addPublication: function(req,res){
    var params = req.body;

    if(!params.text)
      return res.status(200).send({message: "Text not exist"});
    var publication = new Publication();
    console.log(req.body)
    publication.text = params.text;
    publication.file="null";
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    publication.save((err,publicationStored) => {
      if(err)
        return res.status(404).send({message: "error storing publication"});
      if(!publicationStored)
        return res.status(404).send({message: "publication hasn't been stored"})
      return res.status(200).send({publication:publicationStored});
    })
  },
  getPublications:function(req,res){

    var page=1;
    if(req.params.page)
      page=req.params.page;

    Follow.find({user:req.user.sub}).populate("followed").exec((err,follows) =>{
      if(err) return res.status(500).send({message: "Error al obtener los seguidores"});

      var followList = [];
      follows.forEach((follow)=>{
        followList.push(follow.followed);
      });
      followList.push(req.user.sub);
      var itemsPage=7;
      var options={
        page:page,
        limit:itemsPage,
        sort:{created_at:"desc"},
        populate:'user'
      }

      Publication.paginate({user:{"$in":followList}},options,(err,publications) =>{
        if(err) return res.status(500).send({message: "Error al devolver las publicaciones"});
        if(!publications) return res.status(404).send({message: "No hay publicaciones"});

        return res.status(200).send({
          publications:publications
        });
      })
    })
    //Publication.find((err,publications) => {
      /*
    Publication.paginate({user:user},options,(err,publications) => {
      if(err)
        return res.status(500).send({message: "Error al solicitar publicaciones"})
      if(!publications)
        return res.status(404).send({message: ""})
      return res.status(200).send({
        publications
      })
    })
    */
  },

  updatePublication:function(req,res){
    var publicationId=req.params.id;
    var publication=req.body.publication;
    console.log(publication)
    Publication.findByIdAndUpdate(publicationId,{text:publication},{new:true},(err,publicationUpdated)=> {
      if(err) return res.status(500).send({message: "Error con la actualización de la publicación"})
        return res.status(200).send({
          publicationUpdated
        })
    })
  },

  deletePublication: function(req,res){
    var publicationId=req.params.id;

    Publication.find({"user":req.user.sub,"_id":publicationId}).remove(err=>{
      if(err) return res.status(500).send({message: "Error al borrar la publicación"});
      return res.status(200).send({publication: "Publicación eliminada"})
    });
  }


}
module.exports = controller;
