import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';


const createArea = gql`
  mutation createArea($data: AreaCreateInput!) {
    createArea(data: $data) {
      id
      nombre
    }
  }
`;

@Component({
  selector: 'app-area-create',
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
          <form [formGroup]="createAreaForm" #f="ngForm" (ngSubmit)="onCreateArea()" class="form">
            <mat-card class="area-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Crear Area</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre del area" formControlName="nombre">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!createAreaForm.valid" aria-label="createArea">
                  <mat-icon>add</mat-icon>
                  <span>Area</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/area" routerLinkActive type="button" aria-label="areasList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de areas</span>
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
export class AreaCreateComponent implements OnInit {

  createAreaForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.createAreaForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  onCreateArea(): void {

    this.loading = true;

    if (this.createAreaForm.valid) {

      this.createAreaForm.disable();
      this.apollo.mutate({
        mutation: createArea,
        variables: {
          data: {
            'nombre': this.createAreaForm.value.nombre,
          }
        }
      }).subscribe(( {data} ) => {
        this.loading = false;
        this.createAreaForm.enable();

        if (data) {
          this.snackBar.open(`Area ${data.createArea.nombre} creado correctamente`, 'X', {duration: 3000});
          this.router.navigate(['admin', 'area']);
        }
      }, (error) => {
        this.loading = false;
        this.createAreaForm.enable();
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
