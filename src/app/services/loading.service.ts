import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingController:LoadingController){ }

  async presentLoading(loadingId:string,loadingMessage:string){
    const loading = await this.loadingController.create({
      id:loadingId,
      message: loadingMessage
    });
    //return await loading.present();
    return loading.present();
  }

  async dismiss(loadingId:string){
    return await this.loadingController.dismiss(loadingId);
  }


  }
