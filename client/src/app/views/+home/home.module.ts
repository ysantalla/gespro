import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { SharedModule } from '@app/shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    data: {title: 'Escritorio'}
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [IndexComponent]
})
export class HomeModule { }
