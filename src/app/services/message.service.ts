import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message';
import { Global } from '../services/Global';
import { StorageService } from '../services/storage.service';
import { from, Observable } from 'rxjs';
import { mergeMap,switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private message:Message;
  private url:string;

  constructor(
    private _http:HttpClient,
    private _storageService:StorageService
  ) {
    this.url = Global.url;
  }

  addMessage(message):Observable<any>{
    return from(this._storageService.getToken()).pipe(
      switchMap(token=> {
        let headers = new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.post(this.url+"message",message,{headers:headers});
      })
    )
  }

  deleteMessage(id):Observable<any>{
    return from(this._storageService.getToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({
          "Content-Type":"application",
          "Authorization":token
        });
        return this._http.delete(this.url+"message/"+id,{headers:headers});
      })
    )
  }

  getReceivedMessages():Observable<any>{
    return from(this._storageService.getToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.get(this.url+"received-messages",{headers:headers});
      })
    )
  }

  getEmmittedMessages():Observable<any>{
    return from(this._storageService.getToken()).pipe(
      switchMap(token => {
        let headers= new HttpHeaders({
          "Content-Type":"application/json",
          "Authorization":token
        });
        return this._http.get(this.url+"sended-messages",{headers:headers});
      })
    )
  }

}
