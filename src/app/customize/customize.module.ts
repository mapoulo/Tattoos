import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomizePageRoutingModule } from './customize-routing.module';

import { CustomizePage } from './customize.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomizePageRoutingModule
  ],
  declarations: [CustomizePage]
})
export class CustomizePageModule {}
