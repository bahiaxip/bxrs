import { Component,OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { StorageService } from '../services/storage.service';
import { PublicationService } from '../services/publication.service';
import { Observable } from 'rxjs';
import { Global } from '../services/Global';

//ejemplo modal y popover
import { ModalController,PopoverController } from '@ionic/angular';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { AddPublicationComponent } from '../add-publication/add-publication.component';
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
  private data;
  private page:number;
  private pages;
  private switchMore:boolean;
  private url:string;
  private clickButton=[];
  constructor(
    private _storageService:StorageService,
    private _publicationService:PublicationService,
    // modal
    private modalController: ModalController,
    private popoverController:PopoverController
  ) {
    this.page=1;
    this.url=Global.url;
  }

  ngOnInit(){
    //console.log("nueva publicacion")

  }
  async settingsPopover(id){
    const siteInfo = {id:1,name:'edupala'};
    const popover = await this.popoverController.create({
      component:SettingsModalComponent,
      //event:ev,
      componentProps:{
        publicationId:id,
      }
    });

    popover.onDidDismiss().then((result) => {
      if(result && result.data)
        console.log(result.data);

      this.getPublications(this.page)
    });

    return await popover.present();
  }

  async presentModal(){
    const modal = await this.modalController.create({
      component:AddPublicationComponent,
      //pasarle datos al modal con componentProps
      /*
      componentProps:{
        'nombre': 'dato'
      }
      */
    });
    //return await modal.present();
    modal.present();

    const publicationData = await modal.onWillDismiss().then(()=>{
      //actualizamos
      this.page=1;
      this.getPublications(this.page);
      //console.log(publicationData);
    });

    //podemos llamar al getPublications

  }
  //podemos hacer la llamada a los datos al iniciar el tab de esta forma,
  //o como se encuentra en los usuarios en tab2.ts (realizando la llamada
  //desde el user.service primero al token y después la petición)
  async getToken(){
    //if(await this._storageService.getToken()){
      await this._storageService.getToken().then((token)=>{
        console.log("el token: ",token)
        this.token=token;
        //this.getPublications(this.token);
      });
    //}else{

    //}

  }
  ionViewWillEnter(){
    this._storageService.getIdentity().then((identi)=>{
      console.log("desde tab1 cridem a identity: ",identi)
      let identity=JSON.parse(identi);
      this.identity=identity.user;
    });

    console.log("nueva publicacion")
    if(!this.publications){
      this.page=1;
      this.getPublications(this.page);
    }else{
      this.getPublications(1);
    }
    console.log(this.publications)


  }

  getPublications(page,adding=false){
    this._publicationService.getPublications(page).subscribe(
      response => {
        if(response){
          if(response.publications){
            if(response.publications.docs && response.publications.docs.length >0){
              this.pages=response.publications.totalPages;
              console.log(response.publications);
              (this.page == this.pages) ? false:true;
              if(!adding)
                this.publications = response.publications.docs;
              else{
                let list1=this.publications;
                let list2 = response.publications.docs;
                this.publications=list1.concat(list2);
              }

            }else{
              console.log("no existe ninguna publicación")
              this.switchMore=false;
            }

          //si no indicamos el tipado(Observable<any>) en el servicio, podemos
          //(aunque no es lo recomendable) indicarlo en formato de array y no nos mostrará error
          //this.publications=response["publications"]
          }else{
            console.log("no existen publicaciones")
          }

        }
      },
      error => {
        /*
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status="error";
        }
        */
      }
    );
  }

  morePublications(){
    console.log("more");
    this.page+=1;
    if(this.page==this.pages)
      this.switchMore=false;
    this.getPublications(this.page,true)
  }

  showMore(id){
    let selectedButton=this.clickButton[id];
    if(!selectedButton)
      this.clickButton[id]=true;
    else
      this.clickButton[id]=false;
    //console.log(this.publications[id])
  }


}
