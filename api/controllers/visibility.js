"use strict"

var Visibility = require("../models/visibility");

var controller = {

  onVisibility:function(req,res){
    var userId = req.user.sub;
    var update = req.body;

    if(update.name || update.surname || update.email || update.phone || update.city || params.image){
      /*
      Visibility.find({user:userId},(err,onVisibility) => {
        if(err) return res.status(500).send({message: "Error en la petición"});
        if(onVisibility)
          Visibility.save({name:})
          return res.status(200).send({
            message: "Se creo la visibilidad",
            data: onVisibility
          })
      })
      */
      Visibility.findOneAndUpdate({user:userId},{update},(err,updated) => {
        if(err) return res.status(500).send({message: "Hubo un error"});
        if(!updated) return res.status(404).send({message: "No existe esa visibilidad"});
        return res.status(200).send({message: "Existe respuesta"});
      })
    }else{
      return res.status(200).send({message: "Faltan datos"});
    }

  },

  offVisibility: function(req,res){

  }
}

module.exports = controller;
