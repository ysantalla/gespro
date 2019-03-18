import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-dashboard',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  isAdmin: Observable<boolean>;
  isSpecialist: Observable<boolean>;
  isJproyecto: Observable<boolean>;
  isProfesor: Observable<boolean>;

  loading = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isSpecialist = this.authService.isSpecialist();
    this.isProfesor = this.authService.isProfesor();
    this.isJproyecto = this.authService.isJProyecto();
  }

}

