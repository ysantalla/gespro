import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

import { IndexComponent } from './index/index.component';
import { RoleGuard } from '@app/core/guard/role.guard';

import { CountEntityComponent } from './count-entity/count-entity.component';
import { CountMProjectComponent } from './count-mproject/count-mproject.component';
import { CountProjectComponent } from './count-project/count-mproject.component';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    data: {title: 'Escritorio', expectedRole: ['ADMIN', 'ESPECIALISTA', 'JPROYECTO', 'PROFESOR']},
    canActivate: [RoleGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [IndexComponent, CountEntityComponent, CountMProjectComponent, CountProjectComponent]
})
export class DashboardModule { }
