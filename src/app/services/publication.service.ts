import { Injectable } from '@angular/core';
import { Global } from './Global';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private url:string=Global.url;

  constructor(private _http:HttpClient, private _storageService:StorageService) { }

  async getToken(){
    //this.token=await this._storageService.getToken();
    return await this._storageService.getToken();
  }


  getPublications(page):Observable<any>{
    return from(this.getToken()).pipe(
      switchMap(token=>{
        let headers= new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.get(this.url+"publications/"+page,{headers:headers});
      })
    )
  }

  addPublication(token,publication){
    let headers = new HttpHeaders({
      "Content-Type" : "application/json",
      "Authorization" : token
    });
    return this._http.post(this.url+"publication",publication,{headers:headers});
  }

}
