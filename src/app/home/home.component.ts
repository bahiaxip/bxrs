import { Component, OnInit } from '@angular/core';
//import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private login:boolean=false;
  //private __storage:Storage;
  constructor(
    //private _storage:Storage,
    private _router:Router,
    private _userService:UserService,
    private _storageService:StorageService

  )
  {

  }

  async ngOnInit() {
    console.log("home");

    /*if(localStorage){
      this._storageService.clear();
      console.log("yea1")
    }
    */
  }
  async identity(){
    if(await this._storageService.getIdentity()){
      this.login=true;
      console.log(JSON.parse(await this._storageService.getIdentity()));
      this._router.navigate(["/tabs"]);
    }
  }

  ionViewWillEnter(){
    if(!this.login){
      this.identity();
    }

    //this.init();
    /*
    this.databaseExists("__mydb",function(yesno){
      console.log("__mydb  exists? "+yesno);
    })
    */


  }

  /*
  async init(){
    await this._storage.create().then(async (storage) => {
      if(await storage.get("identity")){
        console.log("hola");
        console.log(JSON.parse(await storage.get("identity")));
      }
    })
  }
  */



  /*
  databaseExists(dbname,callback){
    var req=indexedDB.open(dbname);
    var existed=true;
    req.onsuccess=function(){
      req.result.close();
      if(!existed)
        console.log("!existed")
        //indexedDB.deleteDatabase(dbname);
      callback(existed);
    }
    req.onupgradeneeded=function(){
      existed=false;
    }
  }
  */

}
