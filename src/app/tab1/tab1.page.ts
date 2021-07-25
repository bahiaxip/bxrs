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
  private switchMore:boolean=false;
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

  //popover (editar|borrar)
  async settingsPopover(id){
    //filtramos la publicación pulsada con el botón de popover
    let filteredPub = this.publications.filter((item)=>{
      return item._id==id
    })
    //console.log("publicaciones: ",filtroPub[0])
    //const siteInfo = {id:1,name:'edupala'};
    const pub = filteredPub[0];
    const popover = await this.popoverController.create({
      component:SettingsModalComponent,
      //pasamos la publicación pulsada
      componentProps:{
        publication:pub,
      }
    });

    popover.onDidDismiss().then((result) => {
      console.log("result: ",result)
      //si se ha pulsado borrar borramos la publicación
      if(result && result.data){
        if(result.data == "delete"){
          console.log("pulsando delete: ",pub);

          this._publicationService.deletePublication(pub._id).subscribe(
            response=>{
              console.log("publicación eliminada: ",response)
              //crear toast con publicación eliminada y getPublications(this.page)
              this.getPublications(this.page)

            },
            error => {
              //mostrar toast con error
            }
          )

        }
        if(result.data == "edit"){

          console.log("pulsando edit: ",pub);
          this.presentModal(pub);
        }
      }
      //enviamos los datos al modal (add-publication)
        //console.log("filtroPub: ",filtroPub)
        //this.presentModal(result.data);




      //si se ha pulsado editar editamos la publicación


      //this.getPublications(this.page)
    });

    return await popover.present();
  }

  //modal
  async presentModal(pub=null){
    let text;
    if(pub){
      console.log("desde presentModal: ",pub)
      text=pub;
    }
    const modal = await this.modalController.create({
      component:AddPublicationComponent,

      //pasarle datos al modal con componentProps

      componentProps:{
        'publicationUser': pub
      }

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
    if(this.page != this.pages)
      this.switchMore=false;
    if(!this.publications){
      this.page=1;
      this.getPublications(this.page);
    }
    /*
    else{
      this.getPublications(1);
    }
    */
  }

  getPublications(page,adding=false){
    this._publicationService.getPublications(page).subscribe(
      response => {
        if(response){
          console.log("hay respuesta")
          if(response.publications){
            if(response.publications.docs && response.publications.docs.length >0){
              if(this.page == 1 && response.publications.totalPages == 1){
                this.switchMore=true;
              }
              this.pages=response.publications.totalPages;
              console.log("res:",response.publications);
              //(this.page == this.pages) ? false:true;
              if(!adding)
                this.publications = response.publications.docs;
              else{
                let list1=this.publications;
                let list2 = response.publications.docs;
                this.publications=list1.concat(list2);
              }

            }else{
              this.publications=[];
              this.switchMore=true;
              console.log("no existe ninguna publicación")
              //this.switchMore=false;
            }

          //si no indicamos el tipado(Observable<any>) en el servicio, podemos
          //(aunque no es lo recomendable) indicarlo en formato de array y no nos mostrará error
          //this.publications=response["publications"]
          }else{
            this.publications=[];
            //this.switchMore=false;
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
      this.switchMore=true;
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
