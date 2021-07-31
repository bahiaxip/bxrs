import { Component } from '@angular/core';
//controllers
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
//services
import { StorageService } from '../services/storage.service';
import { MessageService } from '../services/message.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
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

  private messages:Message[];
  private sendedMessages:Message[];
  private clickButton:Array<any>=[];
  private clickButton2:Array<any>=[];
  private messageId:any;
  private loading:any;
  private itmReceived=[];
  private itmSended=[];

  constructor(
    private _storageService:StorageService,
    private modalController:ModalController,
    private _messageService:MessageService,
    private popoverController:PopoverController,
    private _loadingService:LoadingService,
    private _toastService:ToastService
  ){
    this.loading=_loadingService;
  }

  async presentModal(){

    const modal = await this.modalController.create({
      component:AddMessageComponent
    });

    return await modal.present();
  }

  ionViewWillEnter(){

    this._storageService.getIdentity().then((identi)=>{
      if(!identi){
        this._storageService.logout();
      }
      this._messageService.getReceivedMessages().subscribe(
        response => {
          console.log(response);
          this.messages=response.messages;
          this.itmReceived=this.messages.map(msge=>false);
          console.log("itemReceived: ",this.itmReceived)
        },
        error => {

        }
      )
      this._messageService.getEmmittedMessages().subscribe(
        response => {
          this.sendedMessages=response.messages;
          this.itmSended=this.sendedMessages.map(sended => false);
          console.log(this.itmSended)
        },
        error => {

        }
      )
    })
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
                this._toastService.deleteToast(true);
                (type=='received') ?
                    this.itmReceived[index]=true : this.itmSended[index]=true;

              }else{
                console.log("hubo un error")
              }

            },
            error => {

            }
          )
        }else{
          //toast con mensaje no se estableción el índice del mensaje
          this.loading.dismiss("messages");
          this._toastService.deleteToast(false);

        }
      }

    })

    return await popover.present();
  }

  async dismiss(dato:string){
    console.log(this.messageId);
    if(dato=="delete"){


    }

    return await this.popoverController.dismiss();

  }

}
