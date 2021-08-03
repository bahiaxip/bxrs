import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage:Storage | null=null;
  private loading:any;
  private changeFollUnFoll=new Subject<void>();
  public changeFollUnFoll$ = this.changeFollUnFoll.asObservable();

  constructor(
    private storage:Storage,
    private _router:Router,
    private _loadingService:LoadingService
  ){
    this.init();
    this.loading=_loadingService;
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
    await this.loading.presentLoading("logout","Cerrando sesión...");
    await this._storage.create().then((storage)=> {
      //opción para evitar mantener variables al desloguear y loguearse de nuevo
      //con otro usuario, pero no buena experiencia para usuario
      //window.location.reload(true);
      storage.clear();
      this.loading.dismiss("logout");
      this._router.navigate(["/"]);
    })
  }

  setChangeFollUnFoll(){
    this.changeFollUnFoll.next();
  }




}
