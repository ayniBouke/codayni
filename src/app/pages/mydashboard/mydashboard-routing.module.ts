import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MydashboardPage } from './mydashboard.page';

const routes: Routes = [
  {
    path: '',
    component: MydashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MydashboardPageRoutingModule {}
