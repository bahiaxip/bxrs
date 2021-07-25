"use strict";

var Message = require("../models/message");
var moment = require("moment");
var controller = {

  saveMessage: function(req,res){
    var params = req.body;

    if(!params.text || !params.receiver)
      return res.status(500).send({message: "Faltan datos"});
    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = "false";

    message.save((err,messageStored) => {
      if(err) return res.status(500).send({message: "Error en la petición"});
      if(!messageStored) return res.status(404).send({message: "Error al guardar mensaje"});
      return res.status(200).send({message:messageStored})
    })
  },

  getReceivedMessages:function(req,res){
    var userId=req.user.sub;

    Message.find({"receiver":userId}).populate("emitter","nick"),((err,messages) =>{
      if(err) return res.status(500).send({message: "Error en la petición del mensaje"});
      if(!messages) return res.status(404).send({message: "No existen mensajes"});

      return res.status(200).send({
        messages
      })
    })
  },

  getEmmitedMessages:function(req,res){
    var userId = req.user.sub;

    Message.find({"emitter":userId}).populate("emitter receiver","nick"),((err,messages) => {
      if(err) return res.status(500).send({message: "Error en la petición"});
      if(!messages) return res.status(404).send({message: "No existen mensajes"});
      return res.status(200).send({
        messages
      })
    })
  }

}

module.exports=controller;

