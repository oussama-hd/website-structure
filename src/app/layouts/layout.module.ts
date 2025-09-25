import {NgModule} from '@angular/core';
import { COMPONENTS, EXPORTS, IMPORTS, SERVICES } from '.';

@NgModule({
  imports: [
    ...IMPORTS
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    ...SERVICES
  ],
  exports: [
    ...EXPORTS
  ]
})

export class LayoutModule {}
