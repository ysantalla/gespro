import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';

import { RoleGuard } from '@app/core/guard/role.guard';

import { UserListComponent } from './user/list/user-list.component';
import { UserCreateComponent } from './user/create/user-create.component';
import { UserUpdateComponent } from './user/update/user-update.component';
import { UserDetailsComponent } from './user/details/user-details.component';

import { RoleListComponent } from './role/list/role-list.component';
import { RoleCreateComponent } from './role/create/role-create.component';
import { RoleUpdateComponent } from './role/update/role-update.component';
import { RoleDetailsComponent } from './role/details/role-details.component';

import { FileListComponent } from './file/list/file-list.component';
import { FileUploadComponent } from './file/upload/file-upload.component';
import { FileChangeComponent } from './file/change/file-change.component';
import { FileDetailsComponent } from './file/details/file-details.component';

import { ProjectListComponent } from './project/list/project-list.component';
import { ProjectCreateComponent } from './project/create/project-create.component';
import { ProjectUpdateComponent } from './project/update/project-update.component';
import { ProjectDetailsComponent } from './project/details/project-details.component';

import { AreaCreateComponent } from './area/create/area-create.component';
import { AreaListComponent } from './area/list/area-list.component';
import { AreaDetailsComponent } from './area/details/area-details.component';
import { AreaUpdateComponent } from './area/update/area-update.component';

import { EjeCreateComponent } from './eje/create/eje-create.component';
import { EjeListComponent } from './eje/list/eje-list.component';
import { EjeDetailsComponent } from './eje/details/eje-details.component';
import { EjeUpdateComponent } from './eje/update/eje-update.component';

import { LineaCreateComponent } from './linea/create/linea-create.component';
import { LineaListComponent } from './linea/list/linea-list.component';
import { LineaDetailsComponent } from './linea/details/linea-details.component';
import { LineaUpdateComponent } from './linea/update/linea-update.component';

import { TipoListComponent } from './tipo/list/tipo-list.component';
import { TipoUpdateComponent } from './tipo/update/tipo-update.component';
import { TipoCreateComponent } from './tipo/create/tipo-create.component';
import { TipoDetailsComponent } from './tipo/details/tipo-details.component';
import { AnnoListComponent } from './anno/list/anno-list.component';
import { AnnoCreateComponent } from './anno/create/anno-create.component';
import { AnnoUpdateComponent } from './anno/update/anno-update.component';
import { AnnoDetailsComponent } from './anno/details/anno-details.component';
import { MesListComponent } from './mes/list/mes-list.component';
import { MesCreateComponent } from './mes/create/mes-create.component';
import { MesUpdateComponent } from './mes/update/mes-update.component';
import { MesDetailsComponent } from './mes/details/mes-details.component';
import { IntegranteListComponent } from './integrante/list/integrante-list.component';
import { IntegranteCreateComponent } from './integrante/create/integrante-create.component';
import { IntegranteDetailsComponent } from './integrante/details/integrante-details.component';
import { IntegranteUpdateComponent } from './integrante/update/integrante-update.component';
import { AlcanceListComponent } from './alcance/list/alcance-list.component';
import { AlcanceCreateComponent } from './alcance/create/alcance-create.component';
import { AlcanceDetailsComponent } from './alcance/details/alcance-details.component';
import { AlcanceUpdateComponent } from './alcance/update/alcance-update.component';
import { PagoListComponent } from './pago/list/pago-list.component';
import { PagoCreateComponent } from './pago/create/pago-create.component';
import { PagoDetailsComponent } from './pago/details/pago-details.component';
import { PagoUpdateComponent } from './pago/update/pago-update.component';
import { PagoReportComponent } from './report/pago/pago-report.component';
import { DirectoryService } from 'src/app/views/+admin/integrante/services/directory.service';
import { DirectoryComponent } from 'src/app/views/+admin/integrante/directory/directory.component';


const routes: Routes = [
  {
    path: 'project/:projectId/integrantes',
    component: IntegranteListComponent,
    data: {title: 'Listado de Integrantes por Proyecto', expectedRole: ['ADMIN', 'ESPECIALISTA', 'PROFESOR']},
    canActivate: [RoleGuard],
  },
  {
   path: 'report',
   component: PagoReportComponent,
   data: {title: 'Reporte de Pago', expectedRole: ['ESPECIALISTA']},
   canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/create',
    component: IntegranteCreateComponent,
    data: {title: 'Crear Integrante de un proyecto', expectedRole: ['ADMIN', 'ESPECIALISTA', 'PROFESOR']},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/directory',
    component: DirectoryComponent,
    data: {title: 'Buscar Profesor en el directorio', expectedRole: ['ADMIN' ]},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/details/:integranteId',
    component: IntegranteDetailsComponent,
    data: {title: 'Detalles Integrante de un proyecto', expectedRole: ['ADMIN', 'ESPECIALISTA', 'PROFESOR']},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/update/:integranteId',
    component: IntegranteUpdateComponent,
    data: {title: 'Modificar Integrante de un proyecto', expectedRole: ['ADMIN', 'ESPECIALISTA', 'PROFESOR']},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pagos',
    component: PagoListComponent,
    data: {title: 'Listado de Pagos por integrante', expectedRole: ['ADMIN', 'ESPECIALISTA', 'PROFESOR']},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pago/create',
    component: PagoCreateComponent,
    data: {title: 'Crear Pago por integrante', expectedRole: ['ADMIN', 'ESPECIALISTA', 'PROFESOR']},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pago/details/:pagoId',
    component: PagoDetailsComponent,
    data: {title: 'Detalles Pago por integrante', expectedRole: ['ADMIN', 'ESPECIALISTA', 'PROFESOR']},
    canActivate: [RoleGuard],
  },
  {
    path: 'project/:projectId/integrante/:integranteId/pago/update/:pagoId',
    component: PagoUpdateComponent,
    data: {title: 'Modificar Pago de un Integrante', expectedRole: ['ADMIN', 'ESPECIALISTA', 'PROFESOR']},
    canActivate: [RoleGuard],
  },

  {
    path: 'project',
    component: ProjectListComponent,
    data: {title: 'Listado de Proyectos', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'project/create',
    component: ProjectCreateComponent,
    data: {title: 'Crear Proyecto', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'project/update/:id',
    component: ProjectUpdateComponent,
    data: {title: 'Modificar Proyecto', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'project/details/:id',
    component: ProjectDetailsComponent,
    data: {title: 'Detalles Proyecto', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'area',
    component: AreaListComponent,
    data: {title: 'Listado de Areas', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'area/create',
    component: AreaCreateComponent,
    data: {title: 'Crear de areas', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'area/update/:id',
    component: AreaUpdateComponent,
    data: {title: 'Modificar Area', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'area/details/:id',
    component: AreaDetailsComponent,
    data: {title: 'Detalles Area', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },

  {
    path: 'eje',
    component: EjeListComponent,
    data: {title: 'Listado de Ejes', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'eje/create',
    component: EjeCreateComponent,
    data: {title: 'Crear de ejes', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'eje/update/:id',
    component: EjeUpdateComponent,
    data: {title: 'Modificar Eje', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'eje/details/:id',
    component: EjeDetailsComponent,
    data: {title: 'Detalles Eje', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },

  {
    path: 'linea',
    component: LineaListComponent,
    data: {title: 'Listado de Lineas', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'linea/create',
    component: LineaCreateComponent,
    data: {title: 'Crear de lineas', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'linea/update/:id',
    component: LineaUpdateComponent,
    data: {title: 'Modificar Linea', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'linea/details/:id',
    component: LineaDetailsComponent,
    data: {title: 'Detalles Linea', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },

  {
    path: 'alcance',
    component: AlcanceListComponent,
    data: {title: 'Listado de Alcances', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'alcance/create',
    component: AlcanceCreateComponent,
    data: {title: 'Crear de Alcance', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'alcance/update/:id',
    component: AlcanceUpdateComponent,
    data: {title: 'Modificar Alcance', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'alcance/details/:id',
    component: AlcanceDetailsComponent,
    data: {title: 'Detalles Alcance', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'year',
    component: AnnoListComponent,
    data: {title: 'Listado de Annos', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'year/create',
    component: AnnoCreateComponent,
    data: {title: 'Crear de áreas', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'year/update/:id',
    component: AnnoUpdateComponent,
    data: {title: 'Modificar Año', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'year/details/:id',
    component: AnnoDetailsComponent,
    data: {title: 'Detalles Año', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },

  {
    path: 'month',
    component: MesListComponent,
    data: {title: 'Listado de Mess', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'month/create',
    component: MesCreateComponent,
    data: {title: 'Crear de áreas', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'month/update/:id',
    component: MesUpdateComponent,
    data: {title: 'Modificar Año', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'month/details/:id',
    component: MesDetailsComponent,
    data: {title: 'Detalles Año', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'type',
    component: TipoListComponent,
    data: {title: 'Listado de Tipos', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'type/create',
    component: TipoCreateComponent,
    data: {title: 'Crear de tipos', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'type/update/:id',
    component: TipoUpdateComponent,
    data: {title: 'Modificar tipo', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'type/details/:id',
    component: TipoDetailsComponent,
    data: {title: 'Detalles tipo', expectedRole: ['ADMIN', 'ESPECIALISTA']},
    canActivate: [RoleGuard]
  },
  {
    path: 'user',
    component: UserListComponent,
    data: {title: 'Listado de Usuarios', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'user/create',
    component: UserCreateComponent,
    data: {title: 'Crear Usuario', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'user/update/:id',
    component: UserUpdateComponent,
    data: {title: 'Modificar Usuario', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'user/details/:id',
    component: UserDetailsComponent,
    data: {title: 'Detalles Usuario', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'role',
    component: RoleListComponent,
    data: {title: 'Listado de Roles', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'role/create',
    component: RoleCreateComponent,
    data: {title: 'Crear Rol', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'role/update/:id',
    component: RoleUpdateComponent,
    data: {title: 'Modificar Rol', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'role/details/:id',
    component: RoleDetailsComponent,
    data: {title: 'Detalles Rol', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'file',
    component: FileListComponent,
    data: {title: 'Listado de Files', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'file/upload',
    component: FileUploadComponent,
    data: {title: 'Subir Archivo', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'file/change/:id',
    component: FileChangeComponent,
    data: {title: 'Cambiar Archivo', expectedRole: ['ADMIN']},
    canActivate: [RoleGuard]
  },
  {
    path: 'file/details/:id',
    component: FileDetailsComponent,
    data: {title: 'Detalles archivo', expectedRole: ['ADMIN']},
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
    UserListComponent, UserCreateComponent, UserUpdateComponent, UserDetailsComponent,
    RoleListComponent, RoleCreateComponent, RoleUpdateComponent, RoleDetailsComponent,
    FileListComponent, FileUploadComponent, FileChangeComponent, FileDetailsComponent,
    PagoReportComponent,
    ProjectListComponent, ProjectCreateComponent, ProjectUpdateComponent, ProjectDetailsComponent,
    AreaListComponent, AreaCreateComponent, AreaDetailsComponent, AreaUpdateComponent,
    EjeListComponent, EjeCreateComponent, EjeDetailsComponent, EjeUpdateComponent,
    LineaListComponent, LineaCreateComponent, LineaDetailsComponent, LineaUpdateComponent,
    AlcanceListComponent, AlcanceCreateComponent, AlcanceDetailsComponent, AlcanceUpdateComponent,
    TipoListComponent, TipoCreateComponent, TipoDetailsComponent, TipoUpdateComponent,
    AnnoListComponent, AnnoCreateComponent, AnnoDetailsComponent, AnnoUpdateComponent,
    MesListComponent, MesCreateComponent, MesDetailsComponent, MesUpdateComponent,
    IntegranteListComponent, IntegranteCreateComponent, IntegranteDetailsComponent, IntegranteUpdateComponent,
    PagoListComponent, PagoCreateComponent, PagoDetailsComponent, PagoUpdateComponent, DirectoryComponent
  ],
  providers: [
    DirectoryService
  ]
})

export class AdminModule { }
