import { Component, OnInit, AfterViewInit, Renderer2,ViewChild,ElementRef } from '@angular/core';
//import { Storage } from '@ionic/storage-angular';
import { IonRouterOutlet,Platform } from '@ionic/angular';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';


import { Plugins } from '@capacitor/core';

const { App } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  private login:boolean=false;
  private userIdentity;
  private userToken;
  private title:string="IONICRRSS2";
  private switchAllLogo:boolean=false;
  private switchLogo:boolean=false;
  private switchLogo2:boolean=false;
  private switchLogo3:boolean=false;
  private switchLogo4:boolean=false;
  private exitSubscription:any;
  //private __storage:Storage;
  //para ngOnInit (static:true), no necesario ElementRef
  //@ViewChild("welcome",{static:true}) welcome: ElementRef;
  //con renderer
  @ViewChild("welcome") welcome:ElementRef;
  @ViewChild("subtitle") subtitle:ElementRef;
  @ViewChild("#buttonshome") buttonshome:ElementRef;
  constructor(
    //private _storage:Storage,
    private _router:Router,
    private _route:ActivatedRoute,
    private _userService:UserService,
    private _storageService:StorageService,
    private renderer:Renderer2,
    private platform:Platform,
    private routerOutlet:IonRouterOutlet,


  )
  {

    this.platform.backButton.subscribeWithPriority(-1,() => {
      if(this.routerOutlet.canGoBack()){
        console.log("cangoback: ",this.routerOutlet);
        console.log(this._router.url);
      }
      if(!this.routerOutlet.canGoBack() && this._router.url == "/tabs/tab1"){
        //App.exitApp();
        console.log(this._router.url);
      }
    })


  }


  ngOnInit(){



  }

  ngAfterViewInit() {

    //console.log("home: ",this.welcome.nativeElement.innerHTML);
    //this.welcome.nativeElement.innerHTML="";
    if(!this.switchAllLogo){
      this.showingTitle("Bienvenido a BXRS");
      this.switchAllLogo=true;
    }
    /*if(localStorage){
      this._storageService.clear();
      console.log("yea1")
    }
    */
  }
  ionViewDidEnter(){
    this.exitSubscription=this.platform.backButton.subscribeWithPriority(9999,()=> {
        console.log("Salir");
        App.exitApp();
    })
  }

  ionViewWillLeave(){
    console.log("desuscribir salida")
    this.exitSubscription.unsubscribe();
  }

  showingTitle(word){
    let welcome=this.welcome.nativeElement;
    let subtitle=this.subtitle.nativeElement;

    let letters=word.split('');
    let i=0;
    let data="";
    let show = setInterval(()=> {
      //welcome.innerHTML += letters[i];
      data+=letters[i];
      this.renderer.setProperty(welcome,"innerHTML",data);
      i++;
      if(i==letters.length){
        clearInterval(show);
        console.log(data)
        this.renderer.setStyle(subtitle,"opacity","1");
        this.renderer.setStyle(subtitle,"top","12%");
        this.renderer.setStyle(welcome,"color","#FFF");

        setTimeout(()=> {
          this.switchLogo=true;
        },1000)

        setTimeout(()=> {
          this.switchLogo2=true;
        },2000)
        setTimeout(()=> {
          this.switchLogo3=true;
        },3000)
        setTimeout(()=> {
          this.switchLogo4=true;
        },4000)

        /*
        let span = this.renderer.createElement("span");
        let image = this.renderer.createElement("img");
        image.width="128";
        image.className="logo_full";
        image.src="./assets/logobxrs_completo.png";
        this.renderer.appendChild(span,image);
        this.renderer.appendChild(welcome,image);
        */
        //span.innerHTML="hola";
        //this.renderer.;
      }
    },300)
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
          }else{
            console.log("no existe userIdentity.user")
          }
          //this._userService.setIdentity(this.userIdentity.user);
          console.log("this: ",this.userIdentity)
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
