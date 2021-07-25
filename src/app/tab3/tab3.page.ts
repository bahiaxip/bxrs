import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MessageService } from '../services/message.service';
import { AddMessageComponent } from '../add-message/add-message.component';
import { Message } from '../models/message';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private messages:Message[];
  private sendedMessages:Message[];

  constructor(
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


  }

}
