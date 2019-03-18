import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';


const createTipo = gql`
  mutation createTipo($data: TipoCreateInput!) {
    createTipo(data: $data) {
      id
      nombre
    }
  }
`;

@Component({
  selector: 'app-tipo-create',
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
          <form [formGroup]="createTipoForm" #f="ngForm" (ngSubmit)="onCreateTipo()" class="form">
            <mat-card class="tipo-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Crear el Tipo de Proyecto</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre del tipo" formControlName="nombre">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!createTipoForm.valid" aria-label="createTipo">
                  <mat-icon>add</mat-icon>
                  <span>Tipo</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/type" routerLinkActive type="button" aria-label="tiposList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de tipos</span>
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
export class TipoCreateComponent implements OnInit {

  createTipoForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.createTipoForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  onCreateTipo(): void {

    this.loading = true;

    if (this.createTipoForm.valid) {

      this.createTipoForm.disable();
      this.apollo.mutate({
        mutation: createTipo,
        variables: {
          data: {
            'nombre': this.createTipoForm.value.nombre,
          }
        }
      }).subscribe(( {data} ) => {
        this.loading = false;
        this.createTipoForm.enable();

        if (data) {
          this.snackBar.open(`Tipo ${data.createTipo.nombre} creado correctamente`, 'X', {duration: 3000});
          this.router.navigate(['admin', 'type']);
        }
      }, (error) => {
        this.loading = false;
        this.createTipoForm.enable();
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
