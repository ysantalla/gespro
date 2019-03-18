import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';


const createMes = gql`
  mutation createMes($data: MesCreateInput!) {
    createMes(data: $data) {
      id
      nombre
      habilitado
    }
  }
`;

@Component({
  selector: 'app-mes-create',
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
          <form [formGroup]="createMesForm" #f="ngForm" (ngSubmit)="onCreateMes()" class="form">
            <mat-card class="mes-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Crear Mes</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Escoja un mes" formControlName="nombre">

                    <mat-option value="ENERO">ENERO</mat-option>
                    <mat-option value="FEBRERO">FEBRERO</mat-option>
                    <mat-option value="MARZO">MARZO</mat-option>

                    <mat-option value="ABRIL">ABRIL</mat-option>
                    <mat-option value="MAYO">MAYO</mat-option>
                    <mat-option value="JUNIO">JUNIO</mat-option>

                    <mat-option value="JULIO">JULIO</mat-option>
                    <mat-option value="AGOSTO">AGOSTO</mat-option>
                    <mat-option value="SEPTIEMBRE">SEPTIEMBRE</mat-option>

                    <mat-option value="OCTUBRE">OCTUBRE</mat-option>
                    <mat-option value="NOVIEMBRE">NOVIEMBRE</mat-option>
                    <mat-option value="DICIEMBRE">DICIEMBRE</mat-option>

                  </mat-select>
                </mat-form-field>

                <mat-checkbox formControlName="habilitado">Habilitado</mat-checkbox>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!createMesForm.valid" aria-label="createMes">
                  <mat-icon>add</mat-icon>
                  <span>Mes</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/month" routerLinkActive type="button" aria-label="messList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de meses</span>
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
export class MesCreateComponent implements OnInit {

  createMesForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.createMesForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      habilitado: [''],
    });
  }

  onCreateMes(): void {

    this.loading = true;

    if (this.createMesForm.valid) {

      this.createMesForm.disable();
      this.apollo.mutate({
        mutation: createMes,
        variables: {
          data: {
            'nombre': this.createMesForm.value.nombre,
            'habilitado': this.createMesForm.value.habilitado || false,
          }
        }
      }).subscribe(( {data} ) => {
        this.loading = false;
        this.createMesForm.enable();

        if (data) {
          this.snackBar.open(`Mes ${data.createMes.nombre} creado correctamente`, 'X', {duration: 3000});
          this.router.navigate(['admin', 'month']);
        }
      }, (error) => {
        this.loading = false;
        this.createMesForm.enable();
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
