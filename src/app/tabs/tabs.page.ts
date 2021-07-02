import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private _storageService:StorageService,
    private _router:Router
  ) {
    this.identity();
  }

  async identity(){
    if(!await this._storageService.getIdentity()){
      this._router.navigate(["/home"]);
    }
  }
}
