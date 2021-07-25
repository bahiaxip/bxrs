import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from '../services/storage.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.scss'],
})
export class AddMessageComponent implements OnInit {


  private identy:any;
  formAddMessage:FormGroup;

  constructor(
    private _storageService:StorageService,
    private modalController:ModalController
  ) { }

  ngOnInit() {

    this.formAddMessage=new FormGroup({
      text:new FormControl('',[Validators.required])
    })

  }

  ionViewWillEnter(){
    console.log("llega")
    this.identity();
  }

  dismiss(){
    this.modalController.dismiss({
      'dismiss':true
    })

  }

  async identity(){
    if(await this._storageService.getIdentity()){
      this.identy=await this._storageService.getIdentity()
    }
  }

  onSubmit(){

  }

}
