import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController:ToastController) { }

  async presentToast(user,bol){
    let message;
    if(bol)
      message="Ahora sigues a "+user;
    else
      message="Has dejado de seguir a "+user;

      const toast = await this.toastController.create({
        message: message,
        duration: 10000,
        cssClass:'t_center'
      });

    await toast.present();
  }

  async deleteToast(bol){
    let message;
    if(bol)
      message="El mensaje ha sido eliminado correctamente";
    else
      message="No se ha podido eliminar el mensaje";

    const toast = await this.toastController.create({
      message: message,
      duration:10000,
      cssClass:'t_center'
    });
    await toast.present();
  }

  async exitToast(){
    const toast = await this.toastController.create({
      message: "Pulse otra vez atrás para salir",
      duration:2000,
      cssClass:"t_center"
    })
  }
}
