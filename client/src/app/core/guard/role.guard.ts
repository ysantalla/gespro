import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '@app/core/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    // this will be passed from the route config
    // on the data property
    const expectedRole: any[] = route.data.expectedRole;
    const roles: any[] = this.authService.getRoles();

    if (!roles) {
      this.authService.logout();
      this.router.navigate(['auth/login']);
      this.snackBar.open('Rol no encontrado', 'X', {duration: 3000});
      return false;
    }

    if (!this.authService.isLoggedIn() || (!expectedRole.some(role => roles.some(p => p.name === role)))) {
      this.authService.logout();
      this.router.navigate(['auth/login']);
      this.snackBar.open('No tiene permisos', 'X', {duration: 3000});
      return false;
    }
    return true;
  }
}
