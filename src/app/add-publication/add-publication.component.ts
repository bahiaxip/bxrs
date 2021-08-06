import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Publication } from '../models/publication';
import { StorageService } from '../services/storage.service';
import { PublicationService } from '../services/publication.service';
import { UploadService } from '../services/upload.service';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { Global } from '../services/Global';

@Component({
  selector: 'app-add-publication',
  templateUrl: './add-publication.component.html',
  styleUrls: ['./add-publication.component.scss'],
})
export class AddPublicationComponent implements OnInit {
  public publication:Publication;
  public identy;
  public token;
  public status;
  public switchUpdate:boolean=false;
  private publicationUser;
  private url:string;
  formAddPublication:FormGroup;

  private exitSubscription:any;
  private loading:any;

  constructor(
    private _router:Router,
    private _storageService:StorageService,
    private _publicationService: PublicationService,
    private _loadingService:LoadingService,
    private modalController:ModalController,
    private _uploadService:UploadService,
    private _alertService:AlertService,
    private platform:Platform,
  ) {
    this.url=Global.url;
    this.loading=_loadingService;
  }

  ngOnInit() {

    let text='';
    let image;
    if(this.publicationUser && this.publicationUser.text){
      text=this.publicationUser.text
      this.switchUpdate=true;
      /*
      if(this.publicationUser.image && this.publicationUser.image.name){
        image=this.publicationUser.image.name;
      }
      */
      console.log("el publicationUser: ",this.publicationUser)


    }
    this.formAddPublication=new FormGroup({
      text:new FormControl(text,[Validators.required])
    })
  }

  ionViewWillEnter(){
    this.identity();
    console.log(this.formAddPublication.controls.text)
  }
  ionViewDidEnter(){
    this.exitSubscription=this.platform.backButton.subscribeWithPriority(9999,()=> {
      console.log("suscribir salida desde appcomponent");
      this.dismiss();
    })
  }

  ionViewWillLeave(){
    console.log("desuscribir salida")
    this.exitSubscription.unsubscribe();
  }

  dismiss(){
    this.formAddPublication.reset();
    this.modalController.dismiss({
      'dismissed':true,
      //pasamos el publication
      'publication':this.publication
    })
    this.loading.dismiss("publications");
  }

  async identity(){
    //if(this._router.url=="/home"){
    if(await this._storageService.getIdentity()){
      //llega más tarse que tabs
      console.log("desde add-publication: ",JSON.parse(await this._storageService.getIdentity()));
      this.identy=await this._storageService.getIdentity();
    }
  }
  //en lugar de asignar el token en el servicio lo asignamos aquí en el
  //componente, de esa forma, probamos 2 métodos distintos
  async addPublication(){
    await this.loading.presentLoading("publications","Cargando...");
    await this._storageService.getToken().then((token)=>{
      console.log("el token: ",token)
      this.token=token;
      this._publicationService.addPublication(this.token,this.publication).subscribe(
        response => {
          console.log("respuesta de addPublication: ",response);
          if(response && response.publication){
            console.log("resultado publication: ",response.publication)
          }
          if(this.filesToUpload){
            this._uploadService.makeFileRequest(
              this.url+"upload-image-pub/"+response.publication._id,[],
              this.filesToUpload,
              token,
              "imagepub").then((result)=>{
                //para poder acceder a la propiedad "user" mediante punto
                //en lugar de corchetes sin mostrar error es necesario declarar
                //el tipo (Promise) en el método (upload.service)
                //ej:  makeFileRequest(...):Promise<any>
                if(result){
                  console.log("result_publication: ",result)
                  //this.formAddPublication.reset();
                  this.dismiss();
                }
            });
          }else{
            console.log("no existe imagen")
            //this.formAddPublication.reset();
            this.dismiss();
          }
          //this._router.navigate(["/tabs/tab1"]);
        },
        error => {
          if(error.status==401 || error.status==404 || error.status==500){
            this._alertService.presentAlert(error.error.message)
            console.log(error.error.message);
          }else{
            this._alertService.presentAlert("Error desconocido");
            var errorMessage = <any>error;
            console.log("Error desconocido: ",errorMessage);
          }
        }
      )
    });
  }


  async updatePublication(){
    await this.loading.presentLoading("publications","Cargando...");
    this.publicationUser.text=this.formAddPublication.controls.text.value;
    console.log(this.publicationUser)
    await this._storageService.getToken().then((token) => {
      this._publicationService.updatePublication(token,this.publicationUser).subscribe(
        response => {
          console.log("respuesta: ",response);
          if(response && response.publication)
          if(this.filesToUpload){
            this._uploadService.makeFileRequest(
              this.url+"upload-image-pub/"+response.publication._id,[],
              this.filesToUpload,
              token,
              "imagepub").then((result)=>{
                //para poder acceder a la propiedad "user" mediante punto
                //en lugar de corchetes sin mostrar error es necesario declarar
                //el tipo (Promise) en el método (upload.service)
                //ej:  makeFileRequest(...):Promise<any>
                if(result){
                  console.log("result_publication: ",result)
                  //this.formAddPublication.reset();
                  this.dismiss();
                }
            });
          }else{
            console.log("no existe imagen")
            //this.formAddPublication.reset();
            this.dismiss();
          }
        },
        error => {
          if(error.status==401 || error.status==404 || error.status==500){
            this._alertService.presentAlert(error.error.message)
            console.log(error.error.message);
          }else{
            this._alertService.presentAlert("Error desconocido");
            var errorMessage = <any>error;
            console.log("Error desconocido: ",errorMessage);
          }
        }
      )
    })
  }
  onSubmit(){
    this.publication = {
      _id:null,
      text:this.formAddPublication.controls.text.value,
      file:"null",
      user_id:this.identy._id
    }
    console.log("publicación añadida: ",this.publication)
    this.addPublication();
  }

  public filesToUpload:Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload= <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

}
