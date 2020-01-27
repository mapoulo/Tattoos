import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomizePageRoutingModule } from './customize-routing.module';

import { CustomizePage } from './customize.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CustomizePageRoutingModule
  ],
  declarations: [CustomizePage]
})
export class CustomizePageModule {}
