import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MessageService } from '../services/message.service';
import { AddMessageComponent } from '../add-message/add-message.component';
import { Message } from '../models/message';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private messages:Message[];
  private sendedMessages:Message[];
  private clickButton:Array<any>=[];

  constructor(
    private _storageService:StorageService,
    private modalController:ModalController,
    private _messageService:MessageService
  ) {}

  async presentModal(){

    const modal = await this.modalController.create({
      component:AddMessageComponent
    });

    return await modal.present();
  }

  ionViewWillEnter(){

    this._storageService.getIdentity().then((identi)=>{
      if(!identi){
        this._storageService.logout();
      }
      this._messageService.getReceivedMessages().subscribe(
        response => {
          console.log(response);
          this.messages=response.messages;
        },
        error => {

        }
      )
      this._messageService.getEmmittedMessages().subscribe(
        response => {
          this.sendedMessages=response.messages;
        },
        error => {

        }
      )
    })
  }

  showMore(id){
    let selectedButton=this.clickButton[id];
    if(!selectedButton)
      this.clickButton[id]=true;
    else
      this.clickButton[id]=false;
    //console.log(this.publications[id])
  }

}
