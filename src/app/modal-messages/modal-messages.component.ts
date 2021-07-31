import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverService } from '../services/popover.service';

@Component({
  selector: 'app-modal-messages',
  templateUrl: './modal-messages.component.html',
  styleUrls: ['./modal-messages.component.scss'],
})
export class ModalMessagesComponent implements OnInit {

  constructor(
    private popoverController:PopoverController,
    private _popoverService:PopoverService
  ) { }

  ngOnInit() {}

  deleteMessage(){
    console.log("Borrando mensaje")
    this._popoverService.dismiss("mi dato");

  }

}
