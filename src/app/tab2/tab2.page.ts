import { Component } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { FollowService } from '../services/follow.service';
import { Follow } from '../models/follow';
import { StorageService } from '../services/storage.service';
import { Global } from '../services/Global';
import { ToastController, Platform } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { AlertService } from '../services/alert.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  //private changeollow=new Subject<void>();


  private users:Array<User>;
  public clickButton:boolean=false;
  private follow:Follow;
  private identity;
  private identity2;
  private page:number;
  private pages:number;
  private follows:Array<string>;
  private visibility:Array<any>;
  private total:number;
  private switchMore:boolean=false;
  private url:string;
  private visibilityWithPropOne:Array<any>;
  private counter:number;
  private exitSubscription:any;

  constructor(
    private _userService:UserService,
    private _followService:FollowService,
    private _storageService:StorageService,
    private toastController:ToastController,
    private _toastService:ToastService,
    private _alertService:AlertService,
    private platform:Platform,
    private location:Location,
  ){
    this.page=1;
    this.url=Global.url;
  }

  ngOnInit(){

  }
  ngOnDestroy(){
    this.users=null;
    this.follow=null;
    this.pages=null;
    this.page=null;
    this.follow=null;
    this.visibility=null;
    this.visibility=null;
  }

  //refrescar
  doRefresh(event){
    setTimeout(()=> {
      event.target.complete();
      if(this.switchMore)
        this.switchMore=false;
      this.getUsers(1);
    },2000)
  }

  async presentToast(name,bol){
    let toast;
    if(bol){
      toast = await this.toastController.create({
        message: "Siguiendo a "+name,
        duration: 2000,
      });
    }else{
      toast = await this.toastController.create({
        message: "Has dejado de seguir a "+name,
        duration: 2000,
      });
    }
    await toast.present();
  }

  setToast(user,bol){
    this._toastService.presentToast(user,bol)
  }

  ionViewDidEnter(){
    this.exitSubscription=this.platform.backButton.subscribeWithPriority(9999,()=> {
      //console.log("suscribir salida");
      this.location.back();
    })
  }

  ionViewWillLeave(){
    //console.log("desuscribir salida")
    this.exitSubscription.unsubscribe();
  }
  ionViewWillEnter(){
    //this.counter=0;
    //no es necesario obtener el identity...
    this._storageService.getIdentity().then((identi)=>{
      if(!identi){
        this._storageService.logout();
      }
      let identity=JSON.parse(identi);
      this.identity=identity.user;
      //console.log("desde tab2 cridem a identity: ",this.identity)
      if(this.page != this.pages)
        this.switchMore=false;
      if(!this.users || this.identity2 != this.identity){
        this.page=1;
        this.getUsers(this.page);
      }
    });

  }
  getUsers(page,adding=false){
    this._userService.getUsers(page).subscribe(
      response=>{
        if(response && response.users){
          //si solo hay una página no mostramos el botón
          if(this.page == 1 && response.users.totalPages==1)
            this.switchMore=true;
          this.pages=response.users.totalPages;
          if(!adding){
            this.users = response.users.docs;
          }
          else{
            this.users = this.concatList(this.users,response.users.docs);
          }

          this.follows = response.users_following;

          this.visibility = response.visibility;
          //filtramos todos con propiedad one = true , para primer filtrado
          this.visibilityWithPropOne=this.visibility.filter(vis => vis.one)
    //la visibilidad habría que comprobar sin recargar users
          this.setVisibilityToUsers(this.users);
          //this.follows=response.users_following;
          //this.total=response.users.totalDocs;
        }else {
          //this.users=response.users;
        }
        this.identity2=this.identity;
      },
      error=>{
        if(error.status==401 || error.status==404 || error.status==500){
          this._alertService.presentAlert(error.error.message)
          if(error.status==401 || error.error.status==401)
             this._storageService.logout();
          console.log(error.error.message);
        }else{
          this._alertService.presentAlert("Error desconocido");
          var errorMessage = <any>error;
          console.log("Error desconocido: ",errorMessage);
        }
      }
    )
  }

  concatList(listA,listB){
    return listA.concat(listB);
  }

  testFollowing(id){
    return this.follows.includes(id)
  }
  setVisibilityToUsers(users){
    let setDataVisible = users.map((user) => {
      let filteredVis = this.visibilityWithPropOne.filter(vis=>{
        return user._id == vis.user
      })
      if(filteredVis.length>0){
        user.visible={
          name:filteredVis[0].name,
          surname:filteredVis[0].surname,
          email:filteredVis[0].email,
          city:filteredVis[0].city,
          phone:filteredVis[0].phone
        };
      }else{
        user.visible=null;
      }

       //console.log("array de filtrados de cada user: ",user)
    })
  }
  //comprueba si algún dato se ha marcado con visibilidad
  //anulado
  /*
  testVisibility(user){

    this.counter++;
    console.log(this.counter)
    return true;
    //console.log(this.visibility.some(vis => vis.user == id && vis.one ==true));
    /*
    let data= this.visibilityWithPropOne.filter(vis=>
      vis.user == id && vis.one == true
    );
    //console.log(data)
    if(data.length > 0){
      console.log(data)
      return true
    }
    else
      return false;
    //console.log("visibilidad: ",this.visibility)
    //console.log("visibilidad: ", id)
    */
  //}

/*
  setDataIfVisibility(){
    console.log(this.visibility)
  }
*/
  moreUsers(){
    this.page+=1;
    if(this.page==this.pages)
      this.switchMore=true;
    this.getUsers(this.page,true)
  }

  //testFollow (no se despliega cuando clicamos el icono de seguir o dejar de seguir)
  testFollow(followed,method,param=null){
    if(param)
      this.clickButton=true;
    if(method=="follow")
      this.followUser(followed);
    else if(method=="unfollow")
      this.unFollowUser(followed)
    this._storageService.setChangeFollUnFoll();
  }

  //seguir usuario
  followUser(followed){
    //no es necesaria la interface follow
    let follow = {_id:'',user:this.identity._id,followed:followed._id}
    this._followService.addFollow(follow).subscribe(
      response => {
        if(response.follow){
          this.follows.push(followed._id)
          //console.log("nuevos follows: ",this.follows)
          this.setToast(followed.nick,true);
        }
      },
      error => {
        this._alertService.presentAlert("Error desconocido");
          var errorMessage = <any>error;
          console.log("Error desconocido: ",errorMessage);
      }
    );
  }
  //dejar de seguir usuario
  unFollowUser(followed){
    this._followService.deleteFollow(followed._id).subscribe(
      response => {
        this.follows=this.follows.filter(id=>id!=followed._id);
        //console.log(this.follows)
        this.setToast(followed.nick,false);
      },
      error => {
        this._alertService.presentAlert("Error desconocido");
          var errorMessage = <any>error;
          console.log("Error desconocido: ",errorMessage);
      }
    )
  }
}
