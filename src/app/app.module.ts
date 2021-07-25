import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
//no incluir Storage en  providers
//import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
//componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { AddPublicationComponent } from './add-publication/add-publication.component';
import { AddMessageComponent } from './add-message/add-message.component';
//angular material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule }  from '@angular/material/button';
import { MatInputModule }  from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { HTTP_INTERCEPTORS } from '@angular/common/http';
//import { UserService } from './services/user.service';
//import { UploadService } from './services/upload.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddPublicationComponent,
    AddMessageComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__dbIonicRRSS',
      storeName:'ionicrrss',
      //driverOrder:[Drivers.IndexedDB,Drivers.LocalStorage]
      driverOrder:[Drivers.LocalStorage]
    }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,



  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //Storage,
    /*
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserService,
      multi:true,
    }
    */
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
