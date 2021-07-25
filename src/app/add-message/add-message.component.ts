import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from '../services/storage.service';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';

import { ModalController } from '@ionic/angular';

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
  constructor(
    private _storageService:StorageService,
    private modalController:ModalController,
    private _messageService:MessageService,
    private _userService:UserService
  ) { }

  ngOnInit() {

    this.formAddMessage=new FormGroup({
      text:new FormControl('',[Validators.required]),
      receiver:new FormControl('',[Validators.required])
    })
    this.getUsers();

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

  getUsers(){
    this._userService.getTotalUsers().subscribe(
      response => {
        console.log(response)
        this.users=response.users;

      },
      error => {
        console.log(error)
      }
    )
  }

  async identity(){
    if(await this._storageService.getIdentity()){
      this.identy=await this._storageService.getIdentity()
    }
  }

  onSubmit(){
    this.message={
      _id:null,
      text:this.formAddMessage.controls.text.value,
      viewed:"false",
      emitter:this.identy._id,
      receiver:this.formAddMessage.controls.receiver.value
    }
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
