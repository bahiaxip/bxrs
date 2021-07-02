import { Component,OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  private users:Array<User>;

  constructor(private _userService:UserService) {}

  ngOnInit(){


  }


}
