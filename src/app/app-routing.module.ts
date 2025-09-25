// app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainLyoutComponent } from './layouts/main-lyout/main-lyout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLyoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/home.module').then((m) => m.HomePageModule),
      },
      // {
      //   path: 'user-account',
      //   loadChildren: () =>
      //     import('./features/user-account/user-account.module').then(
      //       (m) => m.UserAccountModule
      //     ),
      // }
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      // anchorScrolling: 'enabled',
      // initialNavigation: 'enabled'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}