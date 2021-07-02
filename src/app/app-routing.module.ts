import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//componentes
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch:'full'
  },
  {
    path:'',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path:'home',
    component:HomeComponent,
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  /*
  {
    path:'users',
    component: UsersComponent
  }
  */

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
