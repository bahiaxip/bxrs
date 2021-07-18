import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Publication } from '../models/publication';
import { StorageService } from '../services/storage.service';
import { PublicationService } from '../services/publication.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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

  formAddPublication = new FormGroup({
    text:new FormControl('',[Validators.required])
  })

  constructor(
    private _router:Router,
    private _storageService:StorageService,
    private _publicationService: PublicationService,
    private modalController:ModalController
  ) {

  }

  ngOnInit() {

  }
  ionViewWillEnter(){
    this.identity();
  }

  dismiss(){
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

    //}

  }

  async addPublication(){
    await this._storageService.getToken().then((token)=>{
      console.log("el token: ",token)
      this.token=token;
      this._publicationService.addPublication(this.token,this.publication).subscribe(
        response => {
          console.log("respuesta de addPublication: ",response);
          this.formAddPublication.reset();
          this.dismiss();
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
    //}else{

    //}

  }
  onSubmit(){
    this.publication={
      _id:null,
      text:this.formAddPublication.controls.text.value,
      file:"null",
      user_id:this.identy._id
    }
    console.log("publicación añadida: ",this.publication)
    this.addPublication();
  }

}
