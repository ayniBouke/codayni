import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CofirmPageRoutingModule } from './cofirm-routing.module';

import { CofirmPage } from './cofirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CofirmPageRoutingModule
  ],
  declarations: [CofirmPage]
})
export class CofirmPageModule {}
