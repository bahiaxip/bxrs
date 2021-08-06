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
        duration: 1000,
        position:'top',
        cssClass:'toast_center'
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
      cssClass:'toast_center'
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

  async genericToast(data){
    let message=data;
    const toast = await this.toastController.create({
      message: message,
      duration:2000,
      position:'middle',
      cssClass:'toast_center'
    });
    await toast.present();
  }

}
