import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { XplorePage } from './xplore.page';

const routes: Routes = [
  {
    path: '',
    component: XplorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XplorePageRoutingModule {}
