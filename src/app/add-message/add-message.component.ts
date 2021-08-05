import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from '../services/storage.service';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { LoadingService } from '../services/loading.service';

import { ModalController, Platform } from '@ionic/angular';

import { Message } from '../models/message';
import { User } from '../models/user';
@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.scss'],
})
export class AddMessageComponent implements OnInit {

  private message:Message;
  private identy:any;
  formAddMessage:FormGroup;
  private users:Array<User>;
  private exitSubscription:any;
  private loading:any;

  constructor(
    private _storageService:StorageService,
    private modalController:ModalController,
    private _messageService:MessageService,
    private _userService:UserService,
    private _loadingService:LoadingService,
    private platform:Platform
  ) {
    this.loading=_loadingService;
  }

  ngOnInit() {

    this.formAddMessage=new FormGroup({
      text:new FormControl('',[Validators.required]),
      receiver:new FormControl('',[Validators.required])
    })
  }

  ionViewWillEnter(){
    this.identity().then(()=> {
      this.getUsers(this.identy.user);
    });

    //console.log(this.identy._id);
  }
  ionViewDidEnter(){
    this.exitSubscription=this.platform.backButton.subscribeWithPriority(9999,()=> {
      console.log("suscribir salida desde addmessages");
      this.dismiss();
    })
  }

  ionViewWillLeave(){
    console.log("desuscribir salida")
    this.exitSubscription.unsubscribe();
  }

  dismiss(){
    this.modalController.dismiss({
      'dismiss':true
    })
    this.loading.dismiss("publications");
  }

  getUsers(identi){
    this._userService.getTotalUsers().subscribe(
      response => {
        //filtramos para no enviar mensajes al propio usuario
        this.users=response.users.filter(user => {
          return user._id != identi._id
        });

      },
      error => {
        console.log(error)
      }
    )
  }

  async identity(){
    if(await this._storageService.getIdentity()){
      this.identy=JSON.parse(await this._storageService.getIdentity())
    }
  }

  async onSubmit(){
    this.message={
      _id:null,
      text:this.formAddMessage.controls.text.value,
      viewed:"false",
      emitter:this.identy._id,
      receiver:this.formAddMessage.controls.receiver.value,
      created_at:null
    }
    await this.loading.presentLoading("messages","Cargando...");
    this._messageService.addMessage(this.message).subscribe(
      response => {
        console.log(response)
        this.formAddMessage.reset();
        this.dismiss();
      },
      error => {

      }
    )

  }

}
