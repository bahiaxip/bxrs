import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage:Storage | null=null;

  constructor(private storage:Storage){
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


}
