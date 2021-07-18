import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { PerfilPageRoutingModule } from './perfil-routing.module';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
//angular material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
//Pages
import { PerfilPage } from './perfil.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    ExploreContainerComponentModule,
    MatInputModule,
    MatIconModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {}
