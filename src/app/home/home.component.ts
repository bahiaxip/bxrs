import { Component, OnInit } from '@angular/core';
//import { Storage } from '@ionic/storage-angular';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private login:boolean=false;
  private userIdentity;
  private userToken;
  private title:string="IONICRRSS2";
  //private __storage:Storage;
  constructor(
    //private _storage:Storage,
    private _router:Router,
    private _route:ActivatedRoute,
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

    //anulamos el getIdentity del user.service, tan solo el de storageservice
    /*
    if(!this._userService.getIdentity()){
      console.log("no existe getIdentity en userservice: ", this._userService.getIdentity());
      //this._router.navigate(["/home"]);
    }
    */
    //if(this._router.url=="/home"){
      if(await this._storageService.getIdentity()){
        await this._storageService.getIdentity().then((identity) => {
          this.userIdentity=JSON.parse(identity);
          if(this.userIdentity.user){
            this._router.navigate(["/tabs"]);
          }
          //this._userService.setIdentity(this.userIdentity.user);
          console.log(this.userIdentity)
        })
        //await this._storageService.getToken().then((token) => {
          //this._userService.setToken(token);

        //})
        //this.login=true;


        //llega más tarse que tabs
        //console.log("desde home: ",JSON.parse(await this._storageService.getIdentity()));

      }else{
        console.log("a home")
        this._router.navigate(["/home"]);
      }
    //}

  }

  ionViewWillEnter(){

    //if(!this.login){
      //console.log("no existe login")
      this.identity();
    //}

    //this.getPublications();

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
