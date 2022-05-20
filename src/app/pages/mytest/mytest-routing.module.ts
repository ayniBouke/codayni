import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MytestPage } from './mytest.page';

const routes: Routes = [
  {
    path: '',
    component: MytestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MytestPageRoutingModule {}
