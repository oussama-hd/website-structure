// home.routing.ts
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home.component';

const homePageRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'SportAcademy - Accueil' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(homePageRoutes)],
  exports: [RouterModule]
})
export class HomePageRouting {}
