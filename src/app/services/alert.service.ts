import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController:AlertController){

  }

  async presentAlert(message:string){
    const alert = await this.alertController.create({
      message: message,
      header: "Error",
      buttons:['OK'],
      cssClass:'alert_message'

    });

    await alert.present();
  }
}
