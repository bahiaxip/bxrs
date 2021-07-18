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
    console.log("nueva publicacion")
    this.getUsers(this.page);
  }
  getUsers(page){
    this._userService.getUsers(page).subscribe(
      response=>{
        if(!response){
          console.log(response)
        }else{
          console.log(response);
          this.users=response.users;
        }
      },
      error=>{
        //console.log(error);
      }
    )
  }
  testfollow(followed,param=null){
    if(param)
      this.clickButton=true;
    this.followUser(followed);
    console.log("follow: ",followed)
  }
  //seguir usuario
  followUser(followed){
    console.log(followed);
    //no es necesaria la interface follow
    let follow = {_id:'',user:this.identity._id,followed:followed}
    this._followService.addFollow(follow).subscribe(
      response => {
        console.log(response);
      },
      error => {

      }
    );

  }
  //dejar de seguir usuario
  unFollowUser(followed){

  }

}
