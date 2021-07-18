import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage:Storage | null=null;

  constructor(
    private storage:Storage,
    private _router:Router
  ){
    this.init();
  }

  async init(){
    const storage=await this.storage.create();
    this._storage=storage;
  }

  public set (key:string,value:any){
    this._storage?.set(key,value);
  }

  public async clear(){
    await this._storage?.clear();
  }

  async getIdentity(){
    if(await this._storage?.get("identity")){
      return await this._storage?.get("identity");
    }
  }
  async getToken(){
   if(await this._storage?.get("token")){
      return await this._storage?.get("token");
    }
  }
  async logout(){
    await this._storage.create().then((storage)=> {
      storage.clear();
      this._router.navigate(["/"]);
    })
  }


}
