import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MydashboardPageRoutingModule } from './mydashboard-routing.module';

import { MydashboardPage } from './mydashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MydashboardPageRoutingModule
  ],
  declarations: [MydashboardPage]
})
export class MydashboardPageModule {}
