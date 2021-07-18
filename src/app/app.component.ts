import { Component,OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
//import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{

  private title:string="IONICRRSS";

  constructor(private _storage:Storage,private _router:Router)
  {
    //this.init();

  }

  //mediante el servicio no funciona en app, si en home,
  //es necesario hacerlo directo con Storage, async y await
  /*
  ngOnInit(){
    if(!localStorage){
      this._storageService.clear();
      console.log("yea1")
    }
  }
  */

  async init(){
//revisar si los dispositivos tienen localStorage, cambiar por platform
    //si es en el dispositivo se resetea
    /*if(localStorage)
      await this._storage.create().then((storage) => {
        //storage.set("identity",null);
        storage.clear();
        console.log("clear")
        this._router.navigate(["/home"]);
      })
    else
      this._router.navigate(["/home"]);
    */
  }





}
