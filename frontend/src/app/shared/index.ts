
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatError } from '@angular/material/form-field'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GeneriqueInputComponent } from './components/generique-input/generique-input.component';

export const COMPONENTS = [
  GeneriqueInputComponent
];

export const IMPORTS = [
  CommonModule,
  FlexLayoutModule,
  MatTabsModule,
  MatRippleModule,
  FormsModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  ReactiveFormsModule,
  TranslateModule,
  RouterModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatError,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatStepperModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatCardModule,
  MatListModule,
  MatDialogModule,
  MatDividerModule,
  MatProgressSpinnerModule
];

export const SERVICES = [provideNativeDateAdapter()];

export const EXPORTS = [
  CommonModule,
  FlexLayoutModule,
  MatRippleModule,
  GeneriqueInputComponent
];
