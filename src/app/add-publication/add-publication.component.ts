import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Publication } from '../models/publication';
import { StorageService } from '../services/storage.service';
import { PublicationService } from '../services/publication.service';
import { UploadService } from '../services/upload.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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

  constructor(
    private _router:Router,
    private _storageService:StorageService,
    private _publicationService: PublicationService,
    private modalController:ModalController,
    private _uploadService:UploadService
  ) {
    this.url=Global.url;
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

  dismiss(){
    this.formAddPublication.reset();
    this.modalController.dismiss({
      'dismissed':true,
      //pasamos el publication
      'publication':this.publication
    })
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
                  this.formAddPublication.reset();
                  this.dismiss();
                }
            });
          }else{
            console.log("no existe imagen")
            this.formAddPublication.reset();
            this.dismiss();
          }
          //this._router.navigate(["/tabs/tab1"]);
        },
        error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if(errorMessage != null)
            this.status="error";
        }
      )
    });
  }


  async updatePublication(){
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
                  this.formAddPublication.reset();
                  this.dismiss();
                }
            });
          }else{
            console.log("no existe imagen")
            this.formAddPublication.reset();
            this.dismiss();
          }
        },
        error => {

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
