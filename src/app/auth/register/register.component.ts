import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { LoadingService } from '../../services/loading.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public title:string;
  public user:User;
  public status:string;
  private loading:any;

  form = new FormGroup({
    nick:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)])
  })

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _loadingService:LoadingService,
    private _alertService:AlertService
  ) {
    this.title="Registrarse";
    this.loading=_loadingService;
  }



  ngOnInit() {}


  onSubmit(){
    this.user={
      _id:null,
      name:"",
      surname:null,
      nick:this.form.controls.nick.value,
      email:this.form.controls.email.value,
      password:this.form.controls.password.value,
      city:"",
      phone:"",
      role:"",
      image:null
    }
    this.loading.presentLoading("register","Cargando...");
    this._userService.register(this.user).subscribe(
      response =>{
        this.loading.dismiss("register");
        if(response.user && response.user._id){
          //console.log(response.message);

          this.status="success";
          this.form.reset();
          this._router.navigate(["/home"]);
        }else{
          this.status="error";
          console.log("hola:",response);
        }

      },
      error=>{
        if(error.status==404 || error.status==409 || error.status== 422 || error.status==500){

          this._alertService.presentAlert(error.error.message);
        }
        console.log(<any>error);
      }
    );

  }

}
