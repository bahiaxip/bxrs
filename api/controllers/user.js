"use strict"

var User=require("../models/user");

//librería de encriptación para el pass
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");


var controller= {
  home:function(req,res){
    return res.status(200).send({
      message:"Hola mundo desde el servidor NodeJS"
    })
  },
  saveUser: function(req,res){
    var params=req.body;
    var user = new User();
    console.log(req.body);
    if(params.name && params.nick && params.email && params.password){
      user.name = params.name;
      user.nick = params.nick
      user.email = params.email;
      user.image = null;

      User.find({$or: [
          {email:user.email.toLowerCase()},
          {nick: user.nick.toLowerCase()}
        ]}).exec((err,users) => {
          if(err) return res.status(500).send({message: "Error en la petición de usuario"});

          if(users && users.length >= 1){
            return res.status(200).send({
              message: "El usuario ya existe"
            });
          }else{
            bcrypt.hash(params.password,null,null,(err,hash) => {
              user.password=hash;
              user.save((err,userStored) => {
                if(err) return res.status(500).send({
                  message: "Error al guardar el usuario"
                })
                if(userStored){
                  res.status(200).send({
                    user:userStored,
                    message: "Usuario creado correctamente"
                  })
                }else{
                  res.status(404).send({
                    message: "No se ha podido crear el usuario"
                  })
                }
              });
            });
          }
        })

    }else{
      res.status(200).send({
        message: "Faltan datos"
      });
    }
  },

  getUsers:function(req,res){
    //var identity_user_id=req.user.sub;
    //var page=1;
    /*
    if(req.params.page){
      page= req.params.page;
    }
    var itemsPerPage = 5;
    */

    //User.find().sort("_id").paginate(page,itemsPerPage,(err,users,total) => {
    User.find((err,users) => {
      if(err) return res.status(500).send({message: "Error en la petición"});
      if(!users) return res.status(404).send({message: "No hay usuarios disponibles"});

      return res.status(200).send({
        users
      })
    }).sort("_id")
  },
  loginUser:function(req,res){
    var params=req.body;
    var email=params.email;
    var password = params.password;

    User.findOne({email:email},(err,user) => {
      if(err) return res.status(500).send({message: "Error en el inicio de sesión"});
      if(user){
        bcrypt.compare(password,user.password,(err,check) => {
          if(check){
            if(params.gettoken){
              return res.status(200).send({
                token:jwt.createToken(user)
              });
            }
            //por seguridad asignamos undefined
            user.password=undefined;
            return res.status(200).send({user})
          }else{
            return res.status(404).send({message: "El usuario no se ha podido identificar"});
          }
        });
      }else{
        return res.status(404).send({message: "El usuario no se ha podido identificar"});
      }
    });
  },


}

module.exports=controller;
