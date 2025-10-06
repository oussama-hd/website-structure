import {COMPONENTS, IMPORTS, SERVICES, EXPORTS} from '.';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORTS],
  providers: [...SERVICES],
  exports: [...EXPORTS]
})

export class SharedModule {}
