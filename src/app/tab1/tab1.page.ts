import { Component,OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { StorageService } from '../services/storage.service';
import { PublicationService } from '../services/publication.service';
import { Observable,Subscription,BehaviorSubject } from 'rxjs';
import { Global } from '../services/Global';

//ejemplo modal y popover
import { ModalController,PopoverController } from '@ionic/angular';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { AddPublicationComponent } from '../add-publication/add-publication.component';
//import { LoadingController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
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
  private loading:any;

  constructor(
    private _storageService:StorageService,
    private _publicationService:PublicationService,
    // modal
    private modalController: ModalController,
    private popoverController:PopoverController,
    private _loadingService:LoadingService,
    //probando loading en componente
    //private loadingController:LoadingController
  ) {
    this.page=1;
    this.url=Global.url;
    this.loading=_loadingService;
  }

  ngOnInit(){
    /*
    setInterval(()=> {
      this._publicationService.miObservable$.subscribe(data=>{
        if(data)
          console.log("hay un nuevo dato: ",data);
      })
    },3000)
    */
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

  doRefresh(event){
    console.log("vaya");
    setTimeout(()=> {
      console.log("bien");
      event.target.complete();
      console.log("switchMore: ",this.switchMore)
      if(this.switchMore)
        this.switchMore=false;

      this.getPublications(1)
    },2000)
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
    //filtramos la publicación pulsada con el botón de popover
    let filteredPub = this.publications.filter((item)=>{
      return item._id==id
    })
    const ind=indice;
    const pub = filteredPub[0];
    const popover = await this.popoverController.create({
      component:SettingsModalComponent,
      //pasamos la publicación pulsada
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

          console.log("pulsando delete: ",pub);
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
      console.log("desde tab1 cridem a identity: ",identi)
      let identity=JSON.parse(identi);
      this.identity=identity.user;
      console.log("identity desde ionViewWillEnter: ",this.identity);
      console.log("identity2 desde ionViewWillEnter: ",this.identity2);

      console.log("nueva publicacion")
      if(this.page != this.pages)
        this.switchMore=false;
      if(!this.publications || this.identity!=this.identity2){
        console.log("entra en publications recarga")
        this.page=1;
        this.getPublications(this.page);
      }
    });


    /*
    else{ this.getPublications(1); }
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
                for(let i =0;i<this.publications.length;i++){
                  this.itm.push(false);
                }
                console.log("itm: ",this.itm)
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
          console.log("entra en getPublications: ",this.identity)

        this.identity2=this.identity;
        console.log("identity2: ",this.identity2)

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
