import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Observable,from } from 'rxjs'
//var observableFromPromise=from(promiseSrc);
import { map,mergeMap,switchMap } from 'rxjs/operators';
import { Global } from './Global';
import { User } from '../models/user';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url:string = Global.url;
  private identity:string;
  private token:any;

  constructor(
    private _http:HttpClient,
    private _storageService:StorageService
    ) {

    }

  async getToken(){
    return await this._storageService.getToken();
  }

  updateUser(user,token):Observable<any>{
    /*return from(this.getToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": token
        });
        return this._http.put(this.url+"user/"+user._id,user,{headers:headers});
      })
    )*/
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": token
    });
    return this._http.put(this.url+"user/"+user._id,user,{headers:headers});
  }

  register(user):Observable<any>{
      //let params = JSON.stringify(user);
      let headers = new HttpHeaders().set("Content-Type","application/json");
      return this._http.post(this.url+"register",user,{headers:headers});
  }

  login(user,gettoken=null):Observable<any>{
    if(gettoken!=null){
      user=Object.assign(user,{gettoken});
    }

    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.post(this.url+"login",user,{headers:headers});
  }

  getTotalUsers():Observable<any>{
    return from(this.getToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.get(this.url+"users/",{headers:headers});
      })
    )
  }
  /*
  setIdentity(identity){
    this.identity=identity;
  }

  getIdentity(){
    return from(this.getToken())
    return this.identity;
    //return this.identity;
  }
  */
  //esperando el token para realizar la petición http (puede ser switchMap o mergeMap operator de rxjs)
  getUsers(page):Observable<any>{
    return from(this.getToken()).pipe(
      switchMap(token =>{
        let headers=new HttpHeaders({
          "Content-Type":"application/json",
         "Authorization":token
        });
        return this._http.get(this.url+"users/"+page,{headers:headers})
      })
    )

    //.pipe(
      //mergeMap((headers)=>{
        //console.log(headers)

        //.map(rsp=>rsp.json());



    //return logged
      /*


      return this._http.get(this.url+"users",{headers:headers});
      */
  }

  /*
  getUsers():Observable<any>{
      let headers = new HttpHeaders({
        "Content-Type":"application/json",
        "Authorization":this.token
      })
      return this._http.get(this.url+"users",{headers:headers});
  }
  */

  getUser(id):Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.get(this.url+"user/"+id,{headers:headers});
  }

  getVisibility(id):Observable<any>{
    return from(this.getToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.get(this.url+"visibility/"+id,{headers:headers});
      })
    )
  }

  updateVisibility(toggle,id){
    return from(this.getToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.put(this.url+"visibility/"+id,toggle,{headers:headers});
      })
    )
  }

}
