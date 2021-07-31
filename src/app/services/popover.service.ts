import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  private popover:any;
  private messageId:any

  constructor(private popoverController:PopoverController) { }


  async presentPopover(messageId:string,popoverMessage:string){
    this.messageId=messageId;
    this.popover = await this.popoverController.create({
      component:ModalMessagesComponent,
    });

    /*
    popover.onDidDismiss().then(async (result) => {
      console.log("llega al dismiss")
    })
    */
    return await this.popover.present();
  }
  async dismiss(dato:string){
    console.log(this.messageId);
    await this.popover.dismiss();
  }
}
