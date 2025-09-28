//layout.module.ts
import { RouterModule } from '@angular/router';
import {
  FooterComponent,
  HeaderComponent,
  LayoutComponent
} from './components';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslationLoader } from '../lib/translation-loader';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { SharedModule } from '../shared/shared.module';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { NavbarLogoComponent } from './components/navbar-logo/navbar-logo.component';
import { MenuComponent } from './components/menu/menu.component';

export const COMPONENTS = [
  LayoutComponent,
  HeaderComponent,
  FooterComponent, 
  UserMenuComponent,
  MobileMenuComponent,
  NavbarLogoComponent,
  MenuComponent
];

export const IMPORTS = [
  CommonModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) => new TranslationLoader(http),
      deps: [HttpClient]
    }
  }),
  // SharedModule,
  FlexLayoutModule,
  MatSidenavModule,
  // MatFormFieldModule,
  // MatInputModule,
  // MatButtonModule,
  MatMenuModule,
  MatListModule,
  MatIconModule,
  RouterModule,
  MatToolbarModule
];

export const SERVICES = [];

export const EXPORTS = [
  HeaderComponent,
  FooterComponent,
  LayoutComponent
];

