import { Component, OnInit,ViewChild } from '@angular/core';
import { User } from '../models/user';
import { FormGroup, FormControl, Validators,AbstractControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { UploadService } from '../services/upload.service';
import { Router } from '@angular/router';
import { Global } from '../services/Global';
import { ToastController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { LoadingService } from '../services/loading.service';

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
  private switchT:any;
  private loading:any;
  private exitSubscription:any;
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
    name: null,
    surname:null,
    email: null,
    city: null,
    phone: null,
    image: null
  }

  formProfile = new FormGroup({
    name: new FormControl('',[Validators.required]),
    nick: new FormControl('',[Validators.required]),
    surname: new FormControl('',[Validators.minLength(2)]),
    email: new FormControl('',[Validators.required,Validators.email]),
    phone: new FormControl('',[Validators.minLength(8)]),
    city: new FormControl('',[Validators.minLength(2)]),

  })
  //@ViewChild("fileButton",{static:false}) fileButton;
  constructor(
    private _userService:UserService,
    private _router:Router,
    private _storageService:StorageService,
    private _uploadService:UploadService,
    private toastController:ToastController,
    private _loadingService:LoadingService,
    private platform:Platform,
    private location:Location

    ){
    this.url=Global.url;
    this.loading=_loadingService;
  }

  /*
  upload(){
    this.fileButton.nativeElement.click();
  }*/

  async presentToast(data,bol){
    let toast;
    if(bol){
      toast = await this.toastController.create({
        message: "Visibilidad de "+data+" activada",
        duration: 2000,
      });
    }
    else{
      toast = await this.toastController.create({
        message: "Visibilidad de "+data+" desactivada",
        duration: 1000,
      });
    }
    if(this.switchT){
      await toast.present();
      this.updateToggle();
    }
    //toast.present();
  }

  ionViewWillEnter(){
    this._storageService.getIdentity().then((identi)=>{
      if(identi){
        console.log("existe pero no muestra: ",identi)
        let identityUser = JSON.parse(identi);
        this.user=identityUser.user;
        //se podría obtener el visibility desde el mismo identity con un método asíncrono
        //(async) y devolviéndolo en un objeto
        this._userService.getVisibility(this.user._id).subscribe(
          response=>{
            if(response.visibility)
              console.log(response.visibility)
                //al crearse en el registro siempre debería devolver algún resultado.
                this.toggle=response.visibility;
                setTimeout(()=> {
                  this.switchT=true;
                },1000);
                console.log("asignar los visibilities: ",this.toggle)
          },
          error => {

          }
        )
      }else{
        //console.log("no existe identity, ir a home");
        this._router.navigate(["/"])
      }
    });
  }

  ionViewDidEnter(){
    this.exitSubscription=this.platform.backButton.subscribeWithPriority(9999,()=> {
      console.log("suscribir salida");
      this.location.back();
    })
  }

  ionViewWillLeave(){
    console.log("desuscribir salida")
    this.exitSubscription.unsubscribe();
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
    this._storageService.getToken().then(async (token) => {
      await this.loading.presentLoading("updateUser","Cargando...");
      this._userService.updateUser(this.user,token).subscribe(
        response =>{
          this.loading.dismiss("updateUser");
          //console.log(response);
          if(!response.user){
            console.log("Error en la respuesta de la petición");
          }else{
            if(response.visibilityUser){
              this.toggle=response.visibilityUser;
            }
        //actualizar el visibility
            console.log(response.visibilityUser);
            //subir imagen y actualizar storage (set identity)
      //antes comprobar si existe imagen subida
            //this._storageService.set("identity",JSON.stringify(response.user));
            //this.user=response.user;
            if(this.filesToUpload){
              this._uploadService.makeFileRequest(
                this.url+"upload-image-user/"+this.user._id,[],
                this.filesToUpload,
                token,
                "avatar").then((result)=>{
                  //para poder acceder a la propiedad "user" mediante punto
                  //en lugar de corchetes sin mostrar error es necesario declarar
                  //el tipo (Promise) en el método (upload.service)
                  //ej:  makeFileRequest(...):Promise<any>
                  if(result.user){
                    console.log("result_user: ",this.user)

                    this.user.image=result.user.image;
                    this._storageService.set("identity",JSON.stringify(result));
                    //this._userService.updateUser(this.user,token);
                  }
              });
            }else{
              console.log("no existe imagen")
              this._storageService.set("identity",JSON.stringify(response));
            }
          }
        },
        error =>{
          var errorMessage = <any>error;
          console.log(errorMessage);
        }
      )
    })
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

  updateToggle(){
    //console.log("cambio de toggle: "+this.toggle)
    this._userService.updateVisibility(this.toggle,this.user._id).subscribe(
      response => {
        //console.log(response)
      },
      error => {
        console.log(error)
      }
    )
  }

  showToast(toggleName,name){
    console.log(name+": "+toggleName)
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
