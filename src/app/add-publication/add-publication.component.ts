import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Publication } from '../models/publication';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-publication',
  templateUrl: './add-publication.component.html',
  styleUrls: ['./add-publication.component.scss'],
})
export class AddPublicationComponent implements OnInit {
  public publication:Publication;

  formAddPublication = new FormGroup({
    textAddPublication:new FormControl('',[Validators.required])
  })

  constructor(
    private _userService:UserService
  ) {

  }

  ngOnInit() {}

  onSubmit(){
    this.publication={
      _id:null,
      textPublication:this.formAddPublication.controls.textAddPublication.value,
      file:"",
      user_id:""
    }

    console.log("publicación añadida: ",this.publication)
  }

}
