import { Injectable } from '@angular/core';
import { Global } from './Global';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,from,Subject,BehaviorSubject } from 'rxjs';
import { switchMap,tap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private url:string=Global.url;

  private miSubject = new BehaviorSubject<boolean>(false);
  public miObservable$ = this.miSubject.asObservable();


  constructor(
    private _http:HttpClient,
    private _storageService:StorageService,
    private _loadingService:LoadingService
    ) { }


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
    return this._http.post(this.url+"publication",publication,{headers:headers})
    /*.pipe(
      tap((value)=> {
        if(value){
          console.log("mivalue: ",value)
          this.miSubject.next(true);
        }
      })
    );
    */

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
