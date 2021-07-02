import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public title:string;
  public user:User;
  public status:string;

  form = new FormGroup({
    nick:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)])
  })

  constructor(
    private _userService:UserService,
    private _router:Router
  ) {
    this.title="Registrarse";



  }

  ngOnInit() {}

  onSubmit(){
    this.user={
      _id:null,
      name:"",
      surname:"",
      nick:this.form.controls.nick.value,
      email:this.form.controls.email.value,
      password:this.form.controls.password.value,
      role:"",
      image:""
    }

    this._userService.register(this.user).subscribe(
      response =>{
        if(response.user && response.user._id){
          console.log(response.message);
          this.status="success";
          this.form.reset();
          this._router.navigate(["/home"]);
        }else{
          this.status="error";
          console.log(response);
        }

      },
      error=>{
        console.log(<any>error);
      }
    );

  }

}
