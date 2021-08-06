import { Component, OnInit } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';
import { PopoverService } from '../services/popover.service';

@Component({
  selector: 'app-modal-messages',
  templateUrl: './modal-messages.component.html',
  styleUrls: ['./modal-messages.component.scss'],
})
export class ModalMessagesComponent implements OnInit {

  private exitSubscription:any;

  constructor(
    private popoverController:PopoverController,
    private _popoverService:PopoverService,
    private platform:Platform
  ) { }

  ngOnInit() {}

  ionViewDidEnter(){
    this.exitSubscription=this.platform.backButton.subscribeWithPriority(9999,()=> {
      //console.log("suscribir salida desde modalmessagecomponent");
      this.popoverController.dismiss();
    })
  }

  ionViewWillLeave(){
    //console.log("desuscribir salida")
    this.exitSubscription.unsubscribe();
  }

  deleteMessage(){
    //console.log("Borrando mensaje")
    this.popoverController.dismiss("delete");

  }

}
