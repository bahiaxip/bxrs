import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { FormGroup, FormControl, Validators,AbstractControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { UploadService } from '../services/upload.service';
import { Router } from '@angular/router';
import { Global } from '../services/Global';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  private selectedSlide:string;
  private user:User;
  private identity;
  private token;
  private file;
  private url:string;
  private result2:any;
  newUser={
    name:'',
    surname:'',
    nick:'',
    email:'',
    city: '',
    phone: '',
    image: ''
  }

  private toggle ={
    name: Boolean,
    surname:Boolean,
    email: Boolean,
    city: Boolean,
    phone: Boolean,
    image: Boolean
  }

  formProfile = new FormGroup({
    name: new FormControl('',[Validators.required]),
    nick: new FormControl('',[Validators.required]),
    surname: new FormControl('',[Validators.minLength(2)]),
    email: new FormControl('',[Validators.required,Validators.email]),
    phone: new FormControl('',[Validators.minLength(8)]),
    city: new FormControl('',[Validators.minLength(2)]),

  })
  constructor(
    private _userService:UserService,
    private _router:Router,
    private _storageService:StorageService,
    private _uploadService:UploadService
    ){
    this.url=Global.url;
  }
  ionViewWillEnter(){
    console.log("eo")
    this._storageService.getIdentity().then((identi)=>{
      if(identi){
        console.log("existe pero no muestra: ",identi)
        let identityUser = JSON.parse(identi);
        this.user=identityUser.user;
        this._userService.getVisibility(this.user._id).subscribe(
          response=>{
            if(response.visibility)
              if(!response.visibility.one){
                console.log("todos false");
              }else{
                console.log("asignar los visibilities")
              }

          },
          error => {

          }
        )
    //comprobar pk unas veces retorna en un objeto y otras veces en una propiedad user
        console.log("user: ",this.user)
        console.log("user2: ",identityUser)
      }
      else{
        console.log("no existe identity, ir a home");
        this._router.navigate(["/"])
      }

    });
  }

  ngOnInit() {
    console.log("user: ",this.user)

  }
  public filesToUpload:Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload= <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  onSubmit(){
    this._userService.updateUser(this.user).subscribe(
      response =>{
        //console.log(response);
        if(!response.user){
          console.log("Error en la respuesta de la petición");
        }else{
          console.log("llega al else")
          //subir imagen y actualizar storage (set identity)
    //antes comprobar si existe imagen subida
          //this._storageService.set("identity",JSON.stringify(response.user));
          //this.user=response.user;
          this._uploadService.makeFileRequest(
            this.url+"upload-image-user/"+this.user._id,[],
            this.filesToUpload,
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MGRiM2NjNGNjZjJiODQyODZhZmVlZmQiLCJuYW1lIjoieGF2aWVycyIsIm5pY2siOiJ4YXZpZXIiLCJlbWFpbCI6InhhdmllckBob3RtYWlsLmNvbSIsImltYWdlIjpudWxsLCJpYXQiOjE2MjYyNzUyMzQsImV4cCI6MTYyNjQ0ODAzNH0.H44QLAu1tB3cGjwVVaWEuIFgywb34VyTYeB9hU0EAf8",
            "avatar").then((result)=>{
              //para poder acceder a la propiedad "user" mediante punto
              //en lugar de corchetes sin mostrar error es necesario declarar
              //el tipo (Promise) en el método (upload.service)
              //ej:  makeFileRequest(...):Promise<any>
              if(result.user){
                this.user.image.name=result.user.image.name;
                this._storageService.set("identity",JSON.stringify(result));
              }
            });
        }

      },
      error =>{
        var errorMessage = <any>error;
        console.log(errorMessage);
      }
    )
  }

  getUser(id){
    this._userService.getUser(id).subscribe(
      response => {
        console.log("respuesta getUserid: ",response);
        this.user=response.user;
      },
      error => {
        console.log("Error: ",error);
      }

    );
  }
  logout(){
    this._storageService.logout();
  }

  toggleVisibility(){
    console.log("cambio de toggle")
  }

}


/*
@Component({
  selector: 'app-perfil-edit',
  templateUrl: './perfil_edit.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilEdit implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/
