import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PublicationService } from '../services/publication.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {

  //podemos evitar pasar datos en el caso de delete (por seguridad) y pasar tan solo
  // el texto en el edit y evitar pasar datos entre el tab1 y el modal, después a la vuelta
  // actualizar la publicación tan solo del texto

  //evitamos pasar datos
  //private publication:any;

  constructor(
    private popoverController:PopoverController,
    private _publicationService:PublicationService
  ) { }

  ngOnInit() {
    //console.log("modal: ",this.publication._id);
  }

  editPublication(){
    //evitamos pasar datos
    this.popoverController.dismiss('edit');
  }

  deletePublication(){
    //se elimina en el tab1 y evitamos pasar datos
    this.popoverController.dismiss('delete');
    //console.log(this.publication);
    /*
    this._publicationService.deletePublication(this.publication).subscribe(
      response=>{
        console.log(response)
      },
      error => {

      }
    )
    */
//establecer datos para toast
    //this.popoverController.dismiss('toast','deleted');
  }

}
