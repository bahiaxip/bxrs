import { Component,OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { StorageService } from '../services/storage.service';
import { PublicationService } from '../services/publication.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  private identity;
  private users:Array<User>;
  private publications;
  private token;
  private status;
  constructor(
    private _storageService:StorageService,
    private _publicationService:PublicationService
  ) {}

  ngOnInit(){

  }

  async getToken(){
    //if(await this._storageService.getToken()){
      await this._storageService.getToken().then((token)=>{
        console.log("el token: ",token)
        this.token=token;
        this.getPublications(this.token);
      });
    //}else{

    //}

  }
  ionViewWillEnter(){
    this.identity=this._storageService.getIdentity().then((identi)=>{
      console.log("desde tab1 cridem a identity: ",identi)
      this.getToken();
    });


  }

  getPublications(token){
    this._publicationService.getPublications(token).subscribe(
      response => {
        if(response){
          if(response.publications){
            this.publications = response.publications;
          //si no indicamos el tipado(Observable<any>) en el servicio, podemos
          //(aunque no es lo recomendable) indicarlo en formato de array y no nos mostrará error
          //this.publications=response["publications"]
          }
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status="error";
        }
      }
    );
  }


}
