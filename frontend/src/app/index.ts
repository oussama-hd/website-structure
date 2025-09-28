import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {  HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationLoader } from './lib/translation-loader';
import { MainLyoutComponent } from './layouts/main-lyout/main-lyout.component';
import { LayoutModule } from './layouts/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';


export const COMPONENTS = [AppComponent, MainLyoutComponent];

export const IMPORTS = [
  BrowserModule,
  CommonModule,
  LayoutModule,
  MatSidenavModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) => new TranslationLoader(http),
      deps: [HttpClient],
    },
  }),
  RouterModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule
];

export const SERVICES = [];
