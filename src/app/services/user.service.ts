import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './Global';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url:string = Global.url;
  private identity:string;
  private token:string;


  constructor(
    private _http:HttpClient,
    ) {

  }

  register(user):Observable<any>{
      //let params = JSON.stringify(user);
      let headers = new HttpHeaders().set("Content-Type","application/json");
      return this._http.post(this.url+"register",user,{headers:headers});
  }

  login(user,gettoken=null){
    if(gettoken!=null){
      user=Object.assign(user,{gettoken});
    }

    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.post(this.url+"login",user,{headers:headers});
  }

  getIdentity(){
    //let identity = JSON.parse()
  }

  getUsers():Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.get(this.url+"users",{headers:headers});
  }

}
