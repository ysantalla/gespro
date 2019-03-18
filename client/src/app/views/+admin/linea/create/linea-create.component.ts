import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';


const createLinea = gql`
  mutation createLinea($data: LineaCreateInput!) {
    createLinea(data: $data) {
      id
      nombre
    }
  }
`;

@Component({
  selector: 'app-linea-create',
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
          <form [formGroup]="createLineaForm" #f="ngForm" (ngSubmit)="onCreateLinea()" class="form">
            <mat-card class="linea-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Crear Linea</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre del linea" formControlName="nombre">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!createLineaForm.valid" aria-label="createLinea">
                  <mat-icon>add</mat-icon>
                  <span>Linea</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/linea" routerLinkActive type="button" aria-label="lineasList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de lineas</span>
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
export class LineaCreateComponent implements OnInit {

  createLineaForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.createLineaForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  onCreateLinea(): void {

    this.loading = true;

    if (this.createLineaForm.valid) {

      this.createLineaForm.disable();
      this.apollo.mutate({
        mutation: createLinea,
        variables: {
          data: {
            'nombre': this.createLineaForm.value.nombre,
          }
        }
      }).subscribe(( {data} ) => {
        this.loading = false;
        this.createLineaForm.enable();

        if (data) {
          this.snackBar.open(`Linea ${data.createLinea.nombre} creado correctamente`, 'X', {duration: 3000});
          this.router.navigate(['admin', 'linea']);
        }
      }, (error) => {
        this.loading = false;
        this.createLineaForm.enable();
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
