import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';

import { RoleGuard } from '@app/core/guard/role.guard';

import { ProjectListComponent } from './project/list/project-list.component';
import { ProjectDetailsComponent } from './project/details/project-details.component';

import { IntegranteListComponent } from './integrante/list/integrante-list.component';
import { IntegranteCreateComponent } from './integrante/create/integrante-create.component';
import { IntegranteDetailsComponent } from './integrante/details/integrante-details.component';
import { IntegranteUpdateComponent } from './integrante/update/integrante-update.component';

import { PagoListComponent } from './pago/list/pago-list.component';
import { PagoCreateComponent } from './pago/create/pago-create.component';
import { PagoDetailsComponent } from './pago/details/pago-details.component';
import { PagoUpdateComponent } from './pago/update/pago-update.component';
//import { PagoReportComponent } from './report/pago/pago-report.component';
import { DirectoryComponent } from './integrante/directory/directory.component';
import { DirectoryService } from './integrante/services/directory.service';


const routes: Routes = [
  // {
  //  path: 'report',
  //  component: PagoReportComponent,
  //  data: {title: 'Reporte de pago', expectedRole: ['JPROYECTO' ]},
  //  canActivate: [RoleGuard],
  // },
  {
    path: 'project/:projectId/integrantes',
    component: IntegranteListComponent,
    data: {title: 'Listado de Integrantes por Proyecto', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/create',
    component: IntegranteCreateComponent,
    data: {title: 'Crear Integrante de un proyecto', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/directory',
    component: DirectoryComponent,
    data: {title: 'Buscar Profesor en el directorio', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/details/:integranteId',
    component: IntegranteDetailsComponent,
    data: {title: 'Detalles Integrante de un proyecto', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/update/:integranteId',
    component: IntegranteUpdateComponent,
    data: {title: 'Modificar Integrante de un proyecto', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pagos',
    component: PagoListComponent,
    data: {title: 'Listado de Pagos por integrante', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pago/create',
    component: PagoCreateComponent,
    data: {title: 'Crear Pago por integrante', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pago/details/:pagoId',
    component: PagoDetailsComponent,
    data: {title: 'Detalles Pago por integrante', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pago/update/:pagoId',
    component: PagoUpdateComponent,
    data: {title: 'Modificar Pago de un Integrante', expectedRole: ['JPROYECTO' ]},
    canActivate: [RoleGuard],
  },

  {
    path: 'project',
    component: ProjectListComponent,
    data: {title: 'Listado de Proyectos', expectedRole: ['JPROYECTO']},
    canActivate: [RoleGuard]
  },
  {
    path: 'project/details/:id',
    component: ProjectDetailsComponent,
    data: {title: 'Detalles Proyecto', expectedRole: ['JPROYECTO']},
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
    IntegranteListComponent, IntegranteCreateComponent, IntegranteDetailsComponent, IntegranteUpdateComponent,
    PagoListComponent, PagoCreateComponent, PagoDetailsComponent, PagoUpdateComponent, DirectoryComponent
  ],
  providers: [DirectoryService]
})

export class JProyectoModule { }
