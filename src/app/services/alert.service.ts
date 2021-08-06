import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController:AlertController){

  }

  async presentAlert(message:string,type:string=null){
    let header="Error"
    if(type=="sugerencia")
      header="Sugerencia"
    else if(type=="aviso")
      header="Aviso"
    const alert = await this.alertController.create({
      message: message,
      header: header,
      buttons:['OK'],
      cssClass:'alert_message'

    });

    await alert.present();
  }
}
