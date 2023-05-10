import { Component, ViewChild, ElementRef } from '@angular/core';
//controllers
import { ModalController } from '@ionic/angular';
import { PopoverController,Platform } from '@ionic/angular';
import { Location } from '@angular/common';
//services
import { StorageService } from '../services/storage.service';
import { MessageService } from '../services/message.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { AlertService } from '../services/alert.service';
//components
import { AddMessageComponent } from '../add-message/add-message.component';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';
//models
import { Message } from '../models/message';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public messages:Message[];
  public sendedMessages:Message[];
  public clickButton:Array<any>=[];
  public clickButton2:Array<any>=[];
  private messageId:any;
  private loading:any;
  public itmReceived=[];
  public itmSended=[];
  private exitSubscription:any;
  //interval
  private checkNotification:any;
  //fecha último mensaje
  private lastMessageTime:any;
  //interruptor que cambia de botón si existen nuevos mensajes
  public switchButtonMail:boolean=false;

  //activar el icono de refresh cuando se activa mediante el botón de nuevas notificaciones
  public refresherActive:boolean=false;

  @ViewChild("refresherRef", {static:false}) refresher:ElementRef;
  constructor(
    private _storageService:StorageService,
    private modalController:ModalController,
    private _messageService:MessageService,
    private popoverController:PopoverController,
    private _loadingService:LoadingService,
    private _toastService:ToastService,
    private _alertService:AlertService,
    private platform:Platform,
    private location:Location
  ){
    this.loading=_loadingService;
  }

  async presentModal(){

    const modal = await this.modalController.create({
      component:AddMessageComponent
    });

    modal.present();
    const messageData = await modal.onWillDismiss().then(()=> {
      this.getEmmittedMessages();
    })
  }
  //anulado reloadMessages()
/*
  reloadMessages(){
    //this.switchButtonMail=false;
    this.doRefresh(this.refresher,true);
  }
*/

  ionViewWillEnter(){
    this._storageService.getIdentity().then((identi)=>{
      if(!identi){
        this._storageService.logout();
      }
      this.getReceivedMessages();
      this.getEmmittedMessages();
    })

    this.checkNotification=setInterval(()=>{
      //console.log("interval: ",this.lastMessageTime);
      if(this.messages && this.messages.length>0 && this.lastMessageTime){
        //console.log("messages dsd interval: ",this.messages)
        this._messageService.getLastReceivedMessages(this.lastMessageTime).subscribe(
          response => {
            if(response && response.messages){
              let messages = response.messages;
              if(messages.length > 0){
                this.switchButtonMail=true;
                //console.log("interruptor para cambiar icono de mensajes")
              }
            }
          },
          error => {
            if(error.status==401 || error.status==404 || error.status==500){
              console.log(error.error.message);
            }else{
              var errorMessage = <any>error;
              console.log("Error desconocido: ",errorMessage);
            }
          }
        )
      }
    },20000)
  }

  ionViewDidEnter(){
    this.exitSubscription=this.platform.backButton.subscribeWithPriority(9999,()=> {
      //console.log("suscribir salida");
      this.location.back();
    })
  }

  ionViewWillLeave(){
    //console.log("desuscribir salida")
    this.exitSubscription.unsubscribe();
  }

  viewed(messageReceived){
    if(messageReceived.viewed == 'false'){
      //añadimos la clase para mostrar el texto en blanco
      messageReceived.viewed='true';
    //actualizamos la propiedad viewed
      this._messageService.updateReceivedMessage(messageReceived._id).subscribe(
        response => {
          //toast
          this._toastService.genericToast("Mensaje visualizado")
        },
        error =>{
          var errorMessage = <any>error;
          console.log("Error actualizando la opción de mensaje visualizado: ",errorMessage);
        }
      )
    }
  }

  getReceivedMessages(){
    this._messageService.getReceivedMessages().subscribe(
      response => {
        //console.log("mensajes recibidos: ",response.messages)
        this.messages=response.messages;
        if(this.messages.length > 0){
          this.lastMessageTime=this.messages[0].created_at;
          this.itmReceived=this.messages.map(msge=>false);
        }else
          this._alertService.presentAlert("Aun no has recibido ningún mensaje","aviso");
      },
      error => {
        if(error.status==401 || error.status==404 || error.status==500){
          this._alertService.presentAlert(error.error.message)
          if(error.status==401 || error.error.status==401)
             this._storageService.logout();
          console.log(error.error.message);
        }else{
          this._alertService.presentAlert("Error desconocido");
          var errorMessage = <any>error;
          console.log("Error desconocido: ",errorMessage);
        }
      }
    )
  }

  getEmmittedMessages(){
    this._messageService.getEmmittedMessages().subscribe(
      response => {
        this.sendedMessages=response.messages;
        if(this.sendedMessages.length > 0){
          this.itmSended=this.sendedMessages.map(sended => false);
          //console.log(this.itmSended)
        }
      },
      error => {
        if(error.status==401 || error.status==404 || error.status==500){
          this._alertService.presentAlert(error.error.message)
          console.log(error.error.message);
        }else{
          this._alertService.presentAlert("Error desconocido");
          var errorMessage = <any>error;
          console.log("Error desconocido: ",errorMessage);
        }
      }
    )
  }

  getLastReceivedMessages(lastTime){
    this._messageService.getLastReceivedMessages(lastTime).subscribe(
      response=>{
        if(response && response.messages){
          let messages = response.messages;
          if(messages.length >0){
            this.messages=messages.concat(this.messages);
            this.lastMessageTime = this.messages[0].created_at;
          }else{
            //console.log("no existen nuevos mensajes");
          }
        }
      },
      error => {
        if(error.status==401 || error.status==404 || error.status==500){
          this._alertService.presentAlert(error.error.message)
          console.log(error.error.message);
        }else{
          this._alertService.presentAlert("Error desconocido");
          var errorMessage = <any>error;
          console.log("Error desconocido: ",errorMessage);
        }
      }
    )
  }
  doRefresh(event,data=null){
    //cambiamos icono
    this.switchButtonMail=false;
    if(data){
      this.refresherActive=true;
    }
    setTimeout(() => {
      if(data){
        this.refresherActive=false;
        event.el.complete();
      }else{
        event.target.complete();
      }

      if(this.messages){
        console.log(this.lastMessageTime);
        this.getLastReceivedMessages(this.lastMessageTime);
      }else{
        this.getReceivedMessages();
      }
    }, 2000);
  }

  showMore(id,type){
    let selectedButton=this.clickButton[id];
    let selectedButton2=this.clickButton2[id];
    if(type=="received"){
      if(!selectedButton)
        this.clickButton[id]=true;
      else
        this.clickButton[id]=false;
    }else if(type=="sended"){
      if(!selectedButton2)
        this.clickButton2[id]=true;
      else
        this.clickButton2[id]=false;
    }
  }


  messagePopover(id,index){

    this.messageId=id;
    //this.presentPopover();




  }

  async deleteMessage(id,index,type){
    let messageId=id;
    let ind=index;
    let typeMessage=type;

    const popover = await this.popoverController.create({
      component:ModalMessagesComponent,
      cssClass:"popover-style"
    });

    popover.onDidDismiss().then(async (result) => {
      if(result && result.data=="delete"){
        await this.loading.presentLoading("messages","Eliminando...");
        if(messageId){
          this._messageService.deleteMessage(messageId).subscribe(
            response => {
              if(response && response.status=="success"){
                this.loading.dismiss("messages");
                //llamamos al toast y ocultamos de la lista
                this._toastService.genericToast("El mensaje ha sido eliminado correctamente");
                (type=='received') ?
                    this.itmReceived[index]=true : this.itmSended[index]=true;

              }else{
                console.log("Se originó un error")
              }

            },
            error => {
              if(error.status==401 || error.status==404 || error.status==500){
                this._alertService.presentAlert(error.error.message)
                console.log(error.error.message);
              }else{
                this._alertService.presentAlert("Error desconocido");
                var errorMessage = <any>error;
                console.log("Error desconocido: ",errorMessage);
              }
            }
          )
        }else{
          //toast con mensaje no se estableció el índice del mensaje
          this.loading.dismiss("messages");
          this._toastService.genericToast("No se ha podido eliminar el mensaje");
        }
      }
    })

    return await popover.present();
  }

//anulado
/*
  async dismiss(dato:string){
    if(dato=="delete"){


    }

    return await this.popoverController.dismiss();

  }
*/

}
