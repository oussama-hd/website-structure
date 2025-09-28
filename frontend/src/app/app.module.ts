import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { COMPONENTS, IMPORTS, SERVICES } from '.';

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...IMPORTS
  ],
  providers: [
    ...SERVICES
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }