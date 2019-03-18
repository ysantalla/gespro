import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="60%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
            <mat-card class="proyecto-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Error</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <h3 class="mat-h3">
                  Disculpa, usted no esta autorizado a acceder a esa funcionalidad.
                </h3>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="accent" routerLink="/dashboard" routerLinkActive type="button" aria-label="dashboard">
                  <mat-icon>dashboard</mat-icon>
                  <span>Escritorio</span>
                </button>
              </mat-card-actions>
            </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
