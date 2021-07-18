import { Injectable } from '@angular/core';
import { Global } from './Global';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Follow } from '../models/follow';
import { StorageService } from './storage.service';
import { Observable,from } from 'rxjs';
import { map,mergeMap,switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private url:string;
  constructor(
    private _http:HttpClient,
    private _storageService:StorageService
    ){

    this.url=Global.url;
  }

  async getToken(){
    return await this._storageService.getToken();
  }

  addFollow(followed):Observable<any>{
    return from(this._storageService.getToken()).pipe(
      switchMap(token => {
        console.log("token: ",token)
        let headers = new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        console.log("el follow: ",followed)
        return this._http.post(this.url+"follow",followed,{headers:headers});
      })

    )
  }

  deleteFollow(id){
    return from(this._storageService.getToken()).pipe(
      switchMap(token => {
        console.log("token: ",token);
        let headers = new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.delete(this.url+"follow/"+id,{headers:headers})
      })
    )
  }


}
