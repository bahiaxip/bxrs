import { Injectable } from '@angular/core';
import { Global } from './Global';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private url:string=Global.url;

  constructor(private _http:HttpClient) { }

  getPublications(token):Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type":"application/json",
      "Authorization":token
    });
    return this._http.get(this.url+"publications",{headers:headers});
  }

  addPublication(token,publication){
    let headers = new HttpHeaders({
      "Content-Type" : "application/json",
      "Authorization" : token
    });
    return this._http.post(this.url+"publication",publication,{headers:headers});
  }

}
