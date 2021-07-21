import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PublicationService } from '../services/publication.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {
  private publicationId:string;
  constructor(
    private popoverController:PopoverController,
    private _publicationService:PublicationService
  ) { }

  ngOnInit() {
    console.log("modal: ",this.publicationId);
  }

  deletePublication(){
    console.log(this.publicationId);
    this._publicationService.deletePublication(this.publicationId).subscribe(
      response=>{
        console.log(response)
      },
      error => {

      }
    )
//establecer datos para toast
    this.popoverController.dismiss('publication');
  }

}
