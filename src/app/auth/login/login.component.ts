import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Global } from '../../services/Global';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '../../services/storage.service';
import { LoadingService } from '../../services/loading.service';
import { AlertService } from '../../services/alert.service';

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
  private title:string="Login";
  private loading:any;

  form = new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)])
  })

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _storageService:StorageService,
    private _loadingService:LoadingService,
    private _alertService:AlertService
  ) {
    this.title="Login";
    this.loading=_loadingService;
  }

  ngOnInit(){

  }
  ngOnDestroy(){
    this.loading=null;
  }
  /*
  async presentLoading(){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: "Please wait...",
      duration: 10000,
      backdropDismiss:true,
      keyboardClose:true,
      //showBackdrop:true
    });
    await this.loading.present();

    const {role,data} = await this.loading.onDidDismiss();
    console.log("Loading dismissed");
  }
  */
  async onSubmit(){

    this.user = {
      _id:null,
      name:'',
      surname:"",
      nick:"",
      email:this.form.controls.email.value,
      password:this.form.controls.password.value,
      city:"",
      phone:"",
      role:"",
      image:null
    }
    this.loading.presentLoading("login","Cargando...");
    this._userService.login(this.user).subscribe(
      response => {
        this.loading.dismiss();
        this.status="success";
        this.form.reset();
        this._storageService.set("identity",JSON.stringify(response));
        this.getToken();
        //this.loading.dismiss("data1");
      },
      error => {
        this.loading.dismiss();
        if(error.status==404 || error.status==500){
          this._alertService.presentAlert(error.error.message)
          console.log(error.error.message);
        }else{
          this._alertService.presentAlert("Error desconocido");
          var errorMessage = <any>error;
          console.log("Error desconocido: ",errorMessage);
        }
      }
    )
  }

  getToken(){
    this.loading.presentLoading("login","Cargando...");
    this._userService.login(this.user,"true").subscribe(
      response => {
        this.loading.dismiss();
        this.token = response.token;
        if(this.token.length <= 0){
          this.status="error";
        }else{
          this._storageService.set("token",this.token);
          this._router.navigate(["/tabs/tab1"]);
        }
      },
      error => {
        this.loading.dismiss();
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = "error";
        }
      }
    )
  }
}
