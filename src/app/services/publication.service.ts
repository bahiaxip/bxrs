import { Injectable } from '@angular/core';
import { Global } from './Global';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private url:string=Global.url;

  private publicationEndSource = new Subject<void>();
  public publicationEnd$ = this.publicationEndSource.asObservable();
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

  addPublication(token,publication):Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type" : "application/json",
      "Authorization" : token
    });
    return this._http.post(this.url+"publication",publication,{headers:headers});
  }

  updatePublication(token,publication):Observable<any>{
    let headers = new HttpHeaders({
      "Content-Type":"application/json",
      "Authorization":token
    });
    return this._http.put(this.url+"publication/"+publication._id,publication,{headers:headers});
  }

  deletePublication(id){
    return from(this.getToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.delete(this.url+"publication/"+id,{headers:headers});
      })
    )
  }

}
