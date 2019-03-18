import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';

import { RoleGuard } from '@app/core/guard/role.guard';

import { ProjectListComponent } from './project/list/project-list.component';
import { ProjectDetailsComponent } from './project/details/project-details.component';

import { IntegranteListComponent } from './integrante/list/integrante-list.component';
import { IntegranteDetailsComponent } from './integrante/details/integrante-details.component';


import { PagoListComponent } from './pago/list/pago-list.component';
import { PagoDetailsComponent } from './pago/details/pago-details.component';


const routes: Routes = [
  {
    path: 'project/:projectId/integrantes',
    component: IntegranteListComponent,
    data: {title: 'Listado de Integrantes por Proyecto', expectedRole: ['PROFESOR' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/details/:integranteId',
    component: IntegranteDetailsComponent,
    data: {title: 'Detalles Integrante de un proyecto', expectedRole: ['PROFESOR' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pagos',
    component: PagoListComponent,
    data: {title: 'Listado de Pagos por integrante', expectedRole: ['PROFESOR' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pago/details/:pagoId',
    component: PagoDetailsComponent,
    data: {title: 'Detalles Pago por integrante', expectedRole: ['PROFESOR' ]},
    canActivate: [RoleGuard],
  },

  {
    path: 'project',
    component: ProjectListComponent,
    data: {title: 'Listado de Proyectos', expectedRole: ['PROFESOR']},
    canActivate: [RoleGuard]
  },
  {
    path: 'project/details/:id',
    component: ProjectDetailsComponent,
    data: {title: 'Detalles Proyecto', expectedRole: ['PROFESOR']},
    canActivate: [RoleGuard]
  },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ProjectListComponent, ProjectDetailsComponent,
    IntegranteListComponent, IntegranteDetailsComponent,
    PagoListComponent, PagoDetailsComponent,
  ]
})

export class ProfesorModule { }
