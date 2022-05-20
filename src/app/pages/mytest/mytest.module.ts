import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MytestPageRoutingModule } from './mytest-routing.module';

import { MytestPage } from './mytest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MytestPageRoutingModule
  ],
  declarations: [MytestPage]
})
export class MytestPageModule {}
