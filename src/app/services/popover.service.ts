import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';
import { MessageService } from '../services/message.service';
@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  private popover:any;
  private messageId:any
  private envio:any;
  constructor(
    private popoverController:PopoverController,
    private _messageService:MessageService
  ) { }


  async presentPopover(messageId:string,popoverMessage:string){
    this.messageId=messageId;
    this.popover = await this.popoverController.create({
      component:ModalMessagesComponent,
    });


    this.popover.onDidDismiss().then(async (result) => {
      //console.log("llega al dismiss")
      this.envio="mi nuevo dato";
    })

    return await this.popover.present();
  }

  async dismiss(dato:string){
    if(dato=="delete"){
      if(this.messageId){
        this._messageService.deleteMessage(this.messageId).subscribe(
          response => {
            console.log("la respuesta: ",response);
            return "respuesta";
          },
          error => {

          }
        )
      }else{

      }

    }

    return await this.popover.dismiss(this.envio);

  }
}
