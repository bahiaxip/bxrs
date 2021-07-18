import { Injectable } from '@angular/core';
import { Global } from './Global';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url:string;
  private token:any;
  constructor(private _storageService:StorageService) {
    this.url=Global.url;
    this.token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MGRiM2NjNGNjZjJiODQyODZhZmVlZmQiLCJuYW1lIjoieGF2aWVycyIsIm5pY2siOiJ4YXZpZXIiLCJlbWFpbCI6InhhdmllckBob3RtYWlsLmNvbSIsImltYWdlIjpudWxsLCJpYXQiOjE2MjYyNzUyMzQsImV4cCI6MTYyNjQ0ODAzNH0.H44QLAu1tB3cGjwVVaWEuIFgywb34VyTYeB9hU0EAf8";
  }

  makeFileRequest(
    url:string,
    params:Array<string>,
    files:Array<File>,
    token:string,
    name:string
  ):Promise<any>{
    //token=this.token;
    return new Promise(function(res,rej){

      var formData:any = new FormData();
      var xhr = new XMLHttpRequest();

      for(let i=0;i<files.length;i++)
        formData.append(name,files[i]);


      xhr.onreadystatechange = ()=>{
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            res(JSON.parse(xhr.response))
          }else{
            rej(xhr.response);
          }
        }
      }

      xhr.open("POST",url,true);
      xhr.setRequestHeader("Authorization",token);
      xhr.send(formData);
    });
  }


}
