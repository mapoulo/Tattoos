import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { XplorePageRoutingModule } from './xplore-routing.module';

import { XplorePage } from './xplore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    XplorePageRoutingModule
  ],
  declarations: [XplorePage]
})
export class XplorePageModule {}
