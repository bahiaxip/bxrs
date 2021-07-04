import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Global } from '../../services/Global';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public user:User;
  private url:string = Global.url;
  private status:string;
  private token;


  form = new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)])
  })

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _storageService:StorageService
  ) { }

  ngOnInit() {}

  onSubmit(){
    this.user = {
      _id:null,
      name:'',
      surname:"",
      nick:"",
      email:this.form.controls.email.value,
      password:this.form.controls.password.value,
      role:"",
      image:""
    }

    this._userService.login(this.user).subscribe(
      response => {
        //console.log(response)
        this.status="success";
        this.form.reset();
        this._storageService.set("identity",JSON.stringify(response));
        this.getToken();
        console.log("guardado con storage")


      },
      error => {
        console.log(error)
        this.status="error";
      }
    )
  }

  getToken(){
    this._userService.login(this.user,"true").subscribe(
      response => {
        this.token = response.token;
        if(this.token.length <= 0){
          this.status="error";
        }else{
          this._storageService.set("token",this.token);
          this._router.navigate(["/home"]);
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    )
  }
}
