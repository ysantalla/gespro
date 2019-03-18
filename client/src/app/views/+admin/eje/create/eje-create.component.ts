import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';


const createEje = gql`
  mutation createEje($data: EjeCreateInput!) {
    createEje(data: $data) {
      id
      nombre
    }
  }
`;

@Component({
  selector: 'app-eje-create',
  template: `
    <div class="container">
      <div class="loading">
        <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
      </div>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="createEjeForm" #f="ngForm" (ngSubmit)="onCreateEje()" class="form">
            <mat-card class="eje-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Crear Eje</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre del eje" formControlName="nombre">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!createEjeForm.valid" aria-label="createEje">
                  <mat-icon>add</mat-icon>
                  <span>Eje</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/eje" routerLinkActive type="button" aria-label="ejesList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de ejes</span>
                </button>
              </mat-card-actions>
            </mat-card>
          </form>
        </div>
      </div>
    </div>

  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class EjeCreateComponent implements OnInit {

  createEjeForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.createEjeForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  onCreateEje(): void {

    this.loading = true;

    if (this.createEjeForm.valid) {

      this.createEjeForm.disable();
      this.apollo.mutate({
        mutation: createEje,
        variables: {
          data: {
            'nombre': this.createEjeForm.value.nombre,
          }
        }
      }).subscribe(( {data} ) => {
        this.loading = false;
        this.createEjeForm.enable();

        if (data) {
          this.snackBar.open(`Eje ${data.createEje.nombre} creado correctamente`, 'X', {duration: 3000});
          this.router.navigate(['admin', 'eje']);
        }
      }, (error) => {
        this.loading = false;
        this.createEjeForm.enable();
        if (error.graphQLErrors.length > 0) {
          let errorMessage = '';
          error.graphQLErrors.map(graphqlError => {
            errorMessage += graphqlError.message ;
          });
          this.snackBar.open(errorMessage, 'X', {duration: 3000});
        } else if (error.networkError) {
          this.snackBar.open(error.networkError.message, 'X', {duration: 3000});
        } else {
          this.snackBar.open(error.message, 'X', {duration: 3000});
        }
      });

    } else {
      console.log('Form not valid');
    }
  }
}
