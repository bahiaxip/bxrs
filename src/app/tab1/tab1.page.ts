import { Component,OnInit, AfterViewInit,ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { PublicationService } from '../services/publication.service';
import { Observable,Subscription,BehaviorSubject } from 'rxjs';
import { Global } from '../services/Global';

//ejemplo modal y popover
import { ModalController,PopoverController, Platform } from '@ionic/angular';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { AddPublicationComponent } from '../add-publication/add-publication.component';
//import { LoadingController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
//import photoviewer
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';


import { Plugins } from '@capacitor/core';

const { App } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers:[PhotoViewer]
})
export class Tab1Page implements OnInit{
  private identity;
  private identity2;
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
  private itm=[];
  private counterDeleted:number=0;
  private lengthPublications:number=0;
  private slideTextButton=[];
  private miSuscription:Subscription=null;

  //interruptor relacionado con suscripción de cambio seguimiento en tab2
  private switchChangeFollUnFoll:boolean=false;

  private loading:any;
  //interruptor que permite mostrar/ocultar el botón de notificaciones
  private swButtonNot:boolean=false;
  //created_at de la última publicación para notificar nuevas publicaciones
  private lastPublicationTime:any;
  //activar el icono de refresh cuando se activa mediante el botón de nuevas notificaciones
  private refresherActive:boolean=false;
  private exitSubscription:any;
  private counterSubscription:number=0;
  private checkNotification:any;


  @ViewChild("refresherRef", {static:false}) refresher:ElementRef;
  constructor(
    private _storageService:StorageService,
    private _publicationService:PublicationService,
    // modal
    private modalController: ModalController,
    private popoverController:PopoverController,
    private _loadingService:LoadingService,
    private _toastService:ToastService,
    private _router:Router,
    private platform:Platform,
    private photoViewer:PhotoViewer
    //probando loading en componente
    //private loadingController:LoadingController
  ) {
    this.page=1;
    this.url=Global.url;
    this.loading=_loadingService;
  }

  ngOnInit(){

    this.miSuscription = this._storageService.changeFollUnFoll$.subscribe(()=> {
      console.log("switch antes de asignar: ",this.switchChangeFollUnFoll)
      this.switchChangeFollUnFoll=true;

    })



    /*
    this.suscription = this._publicationService.refresh$.subscribe((data)=> {
      console.log("nueva publicación, desde subscription: ",data);
      this.getPublications(1);
    })
    */

    //console.log("nueva publicacion")

  }
  ngOnDestroy(){
    console.log("destruccion");
    this.publications=null;
    console.log(this.publications);
  }
  ngAfterViewInit(){

  }
  //pasado el loading a servicio
  /*
  async presentLoading(){
    if(this.loading != null){
        //this.loading.dismiss();
    }
    this.isLoading=true;
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: "Please wait...",
      duration: 10000,
      backdropDismiss:true,
      keyboardClose:true,
      //showBackdrop:true
    });
    return await this.loading.present();

    const {role,data} = await this.loading.onDidDismiss();
    console.log("Loading dismissed");
  }
  async dismiss(){
    if(this.isLoading){
      await this.loadingController.dismiss().then((d)=> {
        //this.loading=null;
        this.loadingController.dismiss()
        console.log("loading aborted",d)
        this.isLoading=false;
      });
    }
  }
  */

  ionViewDidEnter(){
    this.exitSubscription=this.platform.backButton.subscribeWithPriority(9999,()=> {
      this.counterSubscription++;
      if(this.counterSubscription >= 2){
        console.log("Salir");
        App.exitApp();
      }
      else{
       console.log("toque de nuevo para salir");
       if(this.counterSubscription==1){
         this._toastService.exitToast();
         //damos 3 segundos de intervalo para volver a pulsar y salir
         //si no reiniciamos el contador de salida a 0
         setTimeout(()=> {
         this.counterSubscription=0;
       },3000)
       }

      }

    })
  }

  ionViewWillLeave(){
    console.log("desuscribir salida")
    this.exitSubscription.unsubscribe();
    clearInterval(this.checkNotification);
  }

  showImage(item){
    console.log("wer")
    this.photoViewer.show(this.url+'image-pub/'+item.user.email+'/'+item.image.name);
  }

  async doRefresh(event,data=null){
  //ocultar botón
  this.swButtonNot=false;
    //console.log("evento: ",event);
    if(data){
      this.refresherActive=true;
      }
    setTimeout(()=> {
      if(data){
        this.refresherActive=false;
        event.el.complete();
      }else{
        event.target.complete();
      }

      if(this.switchMore && this.page != this.pages)
        this.switchMore=false;
      if(this.publications){
        this.getLastPublications(this.lastPublicationTime);
      }else{
        this.getPublications(1);
      }
    },3000)
  }
  //resetea los elementos
  resetItm(){
    if(this.itm.length>0)
      this.counterDeleted=0;
      for(let i =0;i<this.itm.length;i++){
        this.itm[i]=false;
      }
  }

  //popover (editar|borrar)
  async settingsPopover(id,indice){
    //filtramos la publicación pulsada con el botón de popover, para seleccionar
    //el elemento de publications a editar/eliminar de la db, el indice sirve para
    //ocultar el elemento de la lista sin recargar publications, utilizando la directiva
    //hidden y el array itm y el método resetitm() que evita que la lista de publicaciones
    //se quede en blanco (en la vista) si varios
    let filteredPub = this.publications.filter((item)=>{
      return item._id==id
    })
    const ind=indice;
    const pub = filteredPub[0];
    const popover = await this.popoverController.create({
      component:SettingsModalComponent,
      cssClass:"popover-style",
      //pasamos la publicación pulsada aunque no es necesario ya que lo editamos/eliminamos en este método, no en el servicio
      componentProps:{
        publication:pub,
      }
    });

    popover.onDidDismiss().then(async (result) => {
      //console.log("result: ",result)

      //si se ha pulsado borrar borramos la publicación
      if(result && result.data){
        await this.loading.presentLoading("publications","Cargando...");
        if(result.data == "delete"){

          //console.log("pulsando delete: ",pub);
          //activamos loading (pasado a servicio)
          //this.presentLoading();


          this._publicationService.deletePublication(pub._id).subscribe(
            response=>{
              this.loading.dismiss("publications");
              //pasado loading a servicio
            /*
              //desactivamos loading
              if(this.loading){
                console.log("entra aquí")
                this.loading.dismiss();
                //si ha sido muy rápida la respuesta y aun no se ha mostrado
                //el loading se cierra asincrónicamente con el método dismiss()
              }else{
                this.dismiss();
              }
            */

              console.log("publicación eliminada: ",response)
              //crear toast con publicación eliminada y getPublications(this.page)

            //en lugar de recargar ocultamos el elemento de la lista y así no recargamos

              if(this.publications && this.publications.length>0){
                //se asigna la cantidad de publicaciones al comienzo de borrar alguna
                this.lengthPublications=this.publications.length;
                //añadimos counterDeleted: si se eliminan las que hay(quedarse en blanco)
                // se reinicia el método para que nunca se quede en blanco
                //getPublications
                this.counterDeleted++;
                 if(this.counterDeleted<this.lengthPublications){
                     console.log("length: ",this.lengthPublications);
                    console.log("id a eliminar: ",pub)
                    console.log("el index: ",ind)
                    //
                    this.itm[ind]=true;
                    let text=this.publications[1].text;
                    let list = (text.match(/\n/g)||[]).length;
                    let match=/'<br>'/g.exec(text);
                    console.log("cantidad: ",match)
                    console.log(this.publications.length);
                    console.log(this.publications)

                    console.log(this.counterDeleted)
                  }else{
                    //reseteamos itm(que permite ocultar los elementos con la
                    //directiva hidden)
                    this.resetItm();
                    this.getPublications(1);
                  }
              }else{
                this.resetItm();
                this.getPublications(1);
              }


              //this.getPublications(this.page)

            },
            error => {
              //mostrar toast con error
            }
          )

        }
        if(result.data == "edit"){

          console.log("pulsando edit: ",pub);
          this.presentModal(pub);
          this.loading.dismiss("publications");
        }
      }
    });

    return await popover.present();
  }

  //modal añadir nueva publicación
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
      //reseteamos el itm por si se ha eliminado antes
      this.resetItm();
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
      if(!identi){
        this._storageService.logout();
      }
      console.log("desde tab1 cridem a identity: ",identi)
      let identity=JSON.parse(identi);
      this.identity=identity.user;
      //console.log("identity desde ionViewWillEnter: ",this.identity);
      //console.log("identity2 desde ionViewWillEnter: ",this.identity2);

      //console.log("nueva publicacion")
      //console.log(this.publications);
      if(this.page != this.pages)
        this.switchMore=false;
      if(!this.publications || this.identity._id!=this.identity2._id){
        console.log("forzamos recarga de publicaciones: ")
        this.page=1;
        this.getPublications(this.page);
      }else if(this.publications && this.publications.length <= 0
        || this.switchChangeFollUnFoll){
        console.log("existe publications pero vacía: ",this.publications);
        this.switchMore=true;
        this.getPublications(this.page)
      }

    });


    //notificación nuevas publicaciones
    this.checkNotification = setInterval(()=> {
      console.log("interval: ",this.lastPublicationTime);
      if(this.publications && this.lastPublicationTime)
      this._publicationService.getLastPublications(this.lastPublicationTime).subscribe(
        response=> {
          if(response && response.publications){
            let newPublications=response.publications;

            if(newPublications.length>0){
              console.log("nuevas publicaciones: ",newPublications)
              //con everyPublications aseguramos que la publicación no es propia
              let everyPublications = newPublications.every(publication => publication.user==this.identity._id)
              console.log("everyPublications: ",everyPublications);
              if(!everyPublications){

              //mostramos botón de nuevas publicaciones
              this.swButtonNot=true;
              console.log("existen nuevas publicaciones que no son mías");
              }
            }
          }
        },
        error => {
          if(error && error.error.status==401){
            console.log("El token no es válido o ha expirado");
            console.log("Es necesario loguearse de nuevo")
            setTimeout(()=> {
              this._storageService.logout()

            },10000)
          }else{
            var errorMessage = <any>error;
            console.log(errorMessage);
          }
        }
      )

    },10000)


    /*
    else{ this.getPublications(1); }
    */
  }
  getLastPublications(lastDate){
    this._publicationService.getLastPublications(lastDate).subscribe(
      response => {
        console.log(response)
        if(response && response.publications){
          let newPublications=response.publications;
          if(newPublications.length>0){
            this.publications=newPublications.concat(this.publications);
            this.lastPublicationTime=this.publications[0].created_at;
          }else{
            if(this.publications && this.publications.length <= 0)
              this.switchMore=true;
            console.log("nmo existen nuevos")
          }
        }

      },
      error => {
        if(error && error.error.status==401){
          console.log("El token no es válido o ha expirado");
          console.log("Es necesario loguearse de nuevo")
          setTimeout(()=> {
            this._storageService.logout()

          },10000)
        }else{
          var errorMessage = <any>error;
          console.log(errorMessage);
        }
      }
    )
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
              if(this.switchChangeFollUnFoll)
                !this.switchChangeFollUnFoll;
              this.pages=response.publications.totalPages;
              console.log("res:",response.publications);
              //(this.page == this.pages) ? false:true;
              if(!adding){
                this.publications = response.publications.docs;
                this.lastPublicationTime=this.publications[0].created_at;
              }
              else{
                let list1=this.publications;
                let list2 = response.publications.docs;
                this.publications=list1.concat(list2);
                this.lastPublicationTime=this.publications[0].created_at;
                /*
                for(let i =0;i<this.publications.length;i++){
                  this.itm.push(false);
                }
                */
                this.itm=this.publications.map(itm=>false);
                console.log("itm: ",this.itm)
              }

            }else{
              this.publications=[];
              this.switchMore=true;
              console.log("no existe ninguna publicación desde getPublications ")
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
          console.log("ha entrado en getPublications: ",this.identity)

        this.identity2=this.identity;
        //console.log("identity2: ",this.identity2)

        }
      },
      error => {
        if(error && error.error.status==401){
          console.log("El token no es válido o ha expirado");
          console.log("Es necesario loguearse de nuevo")
          setTimeout(()=> {
            this._storageService.logout()

          },10000)
        }else{
          var errorMessage = <any>error;
          console.log("Error en publications: ",errorMessage);
        }
        /*


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
