import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  //switch para cuando genera conflicto al llamar al dismiss y no haber cargado aun el present()
  isLoading=false;

  constructor(private loadingController:LoadingController){ }

  /*async presentLoading(loadingId:string,loadingMessage:string){
    const loading = await this.loadingController.create({
      id:loadingId,
      message: loadingMessage,
      duration:10000,
      cssClass: "loading_style"
    });
    //return await loading.present();
    return loading.present();
  }

  async dismiss(loadingId:string){
    return await this.loadingController.dismiss(loadingId);
  }
  */

  async presentLoading(loadingId:string,loadingMessage:string){
    this.isLoading=true;

    return await this.loadingController.create({
      id:loadingId,
      message: loadingMessage,
      duration:10000,
      cssClass: "loading_style"
    }).then((a)=> {
      a.present().then(()=> {
        //console.log("presented");
        if(!this.isLoading){
          a.dismiss().then(()=>{
            //console.log("Abort presenting")
          })
        }
      });
    });

  }

  async dismiss(loadingId:string){
    this.isLoading=false;
    return await this.loadingController.dismiss()
    //.then(()=> {console.log("dismisissed")});
  }


  }
