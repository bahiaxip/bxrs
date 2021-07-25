import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddMessageComponent } from '../add-message/add-message.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    private modalController:ModalController
  ) {}

  async presentModal(){

    const modal = await this.modalController.create({
      component:AddMessageComponent
    });

    return await modal.present();
  }

}
