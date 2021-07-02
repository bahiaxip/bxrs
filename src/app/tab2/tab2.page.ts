import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private users:Array<User>;

  constructor(private _userService:UserService) {}

  ngOnInit(){

    this.getUsers();
  }
  getUsers(){
    this._userService.getUsers().subscribe(
      response=>{
        if(!response){

        }else{
          console.log(response);
          this.users=response.users;
        }

      },
      error=>{
        console.log(error);
      }

    )
  }

}
