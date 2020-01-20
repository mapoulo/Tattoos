import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomizePage } from './customize.page';

const routes: Routes = [
  {
    path: '',
    component: CustomizePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomizePageRoutingModule {}
