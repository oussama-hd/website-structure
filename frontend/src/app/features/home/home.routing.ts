// home.routing.ts
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home.component';

const homePageRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'SportAcademy - Accueil' }
  },
  // {
  //   path: 'user-account',
  //   loadChildren: () =>
  //     import('../user-account/user-account.module').then(
  //       (m) => m.UserAccountModule
  //     ),
  // }
];

@NgModule({
  imports: [RouterModule.forChild(homePageRoutes)],
  exports: [RouterModule]
})
export class HomePageRouting {}
