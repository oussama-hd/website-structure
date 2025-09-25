// index.ts
//home
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePageRouting } from './home.routing';
import { HomeComponent } from './pages/home.component';
// import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// import { CarouselModule } from 'ngx-owl-carousel-o';

import { HeroComponent } from './components/hero/hero.component';

export const COMPONENTS = [HomeComponent, HeroComponent];

export const IMPORTS = [
  HttpClientModule,
  // SharedModule,
  // CarouselModule,
  CommonModule,
  TranslateModule.forChild(),
  ReactiveFormsModule,
  FormsModule,
  HomePageRouting,
  FlexLayoutModule
];

export const SERVICES = [];

export const EXPORTS = [];
