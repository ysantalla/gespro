import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';


const createAlcance = gql`
  mutation createAlcance($data: AlcanceCreateInput!) {
    createAlcance(data: $data) {
      id
      nombre
      valor
    }
  }
`;

@Component({
  selector: 'app-alcance-create',
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
          <form [formGroup]="createAlcanceForm" #f="ngForm" (ngSubmit)="onCreateAlcance()" class="form">
            <mat-card class="alcance-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Crear el Alcance de Proyecto</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre del alcance" formControlName="nombre">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput required type="number" placeholder="Valor del alcance" formControlName="valor">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!createAlcanceForm.valid" aria-label="createAlcance">
                  <mat-icon>add</mat-icon>
                  <span>Alcance</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/alcance" routerLinkActive type="button" aria-label="alcancesList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de alcances</span>
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
export class AlcanceCreateComponent implements OnInit {

  createAlcanceForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.createAlcanceForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }

  onCreateAlcance(): void {

    this.loading = true;

    if (this.createAlcanceForm.valid) {

      this.createAlcanceForm.disable();
      this.apollo.mutate({
        mutation: createAlcance,
        variables: {
          data: {
            'nombre': this.createAlcanceForm.value.nombre,
            'valor': this.createAlcanceForm.value.valor,
          }
        }
      }).subscribe(( {data} ) => {
        this.loading = false;
        this.createAlcanceForm.enable();

        if (data) {
          this.snackBar.open(`Alcance ${data.createAlcance.nombre} creado correctamente`, 'X', {duration: 3000});
          this.router.navigate(['admin', 'alcance']);
        }
      }, (error) => {
        this.loading = false;
        this.createAlcanceForm.enable();
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
