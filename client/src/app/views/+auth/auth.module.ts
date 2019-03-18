import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from '@app/core/guard/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {title: 'Iniciar Sesión'}
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {title: 'Iniciar Sesión'}
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {title: 'Pérfil'},
    canActivate: [AuthGuard]
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
  declarations: [LoginComponent, ProfileComponent]
})
export class AuthModule { }
