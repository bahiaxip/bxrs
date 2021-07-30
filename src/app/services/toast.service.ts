import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController:ToastController) { }

  async presentToast(user,bol){
    let toast;
    if(bol){
      toast = await this.toastController.create({
        message: "Ahora sigues a "+user,
        duration: 10000,
        cssClass:'toast-users'
      });
    }else{
      toast = await this.toastController.create({
        message: "Has dejado de seguir a "+user,
        duration: 10000,
        cssClass:['toast-users','toast-users-span']
      });
    }
    await toast.present();
  }
}
