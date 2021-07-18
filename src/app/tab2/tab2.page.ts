import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { FollowService } from '../services/follow.service';
import { Follow } from '../models/follow';
import { StorageService } from '../services/storage.service';

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
  private total:number;
  private switchMore:boolean=false;

  constructor(
    private _userService:UserService,
    private _followService:FollowService,
    private _storageService:StorageService
  ){
    this.page=1;
  }

  ngOnInit(){
    console.log("eo")

  }
  ionViewWillEnter(){
    //no es necesario obtener el identity...
    this._storageService.getIdentity().then((identi)=>{
      let identity=JSON.parse(identi);
      this.identity=identity.user;
      console.log("desde tab2 cridem a identity: ",this.identity)
    });

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
          this.follows = response.users_following;
          console.log("followings: ",this.follows)
          console.log(this.testFollowing(this.identity._id));
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
