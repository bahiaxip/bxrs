import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { FollowService } from '../services/follow.service';
import { Follow } from '../models/follow';
import { StorageService } from '../services/storage.service';
import { Global } from '../services/Global';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private users:Array<User>;
  public clickButton:boolean=false;
  private follow:Follow;
  private identity;
  private page:number;
  private pages:number;
  private follows:Array<string>;
  private visibility:Array<any>;
  private total:number;
  private switchMore:boolean=false;
  private url:string;
  private visibilityWithPropOne:Array<any>;
  private counter:number;
  constructor(
    private _userService:UserService,
    private _followService:FollowService,
    private _storageService:StorageService
  ){
    this.page=1;
    this.url=Global.url;
  }

  ngOnInit(){
    console.log("eo")

  }
  ionViewWillEnter(){
    this.counter=0;
    //no es necesario obtener el identity...
    this._storageService.getIdentity().then((identi)=>{
      let identity=JSON.parse(identi);
      this.identity=identity.user;
      console.log("desde tab2 cridem a identity: ",this.identity)
    });
    if(this.page != this.pages)
      this.switchMore=false;
    if(!this.users){
      this.page=1;
      this.getUsers(this.page);
    }
  }
  getUsers(page,adding=false){
    this._userService.getUsers(page).subscribe(
      response=>{
        if(response && response.users){
          console.log(response.users)
          //si solo hay una página no mostramos el botón
          if(this.page == 1 && response.users.totalPages==1)
            this.switchMore=true;
          this.pages=response.users.totalPages;
          if(!adding){
            console.log(response.users.docs)
            this.users = response.users.docs;
          }
          else{
            console.log("siguiente pagina: ",response.users.docs)
            this.users = this.concatList(this.users,response.users.docs);
          }
          console.log("users: ",this.users);
          this.follows = response.users_following;
          console.log("followings: ",this.follows)
          console.log(this.testFollowing(this.identity._id));
          console.log("visibility: ",response.visibility)
          this.visibility = response.visibility;
          //filtramos todos con propiedad one = true , para primer filtrado
          this.visibilityWithPropOne=this.visibility.filter(vis => vis.one)
          console.log("propone: ", this.visibilityWithPropOne)
    //la visibilidad habría que comprobar sin recargar users
          this.setVisibilityToUsers(this.users);
          //this.follows=response.users_following;
          //this.total=response.users.totalDocs;
        }else {
          console.log("response")
          //this.users=response.users;
        }
      },
      error=>{
        //console.log(error);
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

       console.log("array de filtrados de cada user: ",user)
    })
  }
  //comprueba si algún dato se ha marcado con visibilidad
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
  }

  setDataIfVisibility(){
    console.log(this.visibility)
  }

  moreUsers(){
    console.log("more");
    this.page+=1;
    if(this.page==this.pages)
      this.switchMore=true;
    this.getUsers(this.page,true)
  }

  //testFollow para que no se despliegue cuando clicamos el icono de seguir o no seguir
  testFollow(followed,method,param=null){
    if(param)
      this.clickButton=true;
    if(method=="follow")
      this.followUser(followed);
    else if(method=="unfollow")
      this.unFollowUser(followed)
    console.log("follow: ",followed)
  }
  //seguir usuario
  followUser(followed){
    console.log(followed);
    //no es necesaria la interface follow
    let follow = {_id:'',user:this.identity._id,followed:followed}
    this._followService.addFollow(follow).subscribe(
      response => {
        if(response.follow){
          console.log(response);
          this.follows.push(followed)
          console.log("nuevos follows: ",this.follows)
        }
      },
      error => {

      }
    );
  }
  //dejar de seguir usuario
  unFollowUser(followed){
    this._followService.deleteFollow(followed).subscribe(
      response => {
        this.follows=this.follows.filter(id=>id!=followed);
        console.log(this.follows)
      },
      error => {

      }
    )
  }

}
