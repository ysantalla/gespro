import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';


const createAnno = gql`
  mutation createAnno($data: AnnoCreateInput!) {
    createAnno(data: $data) {
      id
      numero
      habilitado
    }
  }
`;

@Component({
  selector: 'app-anno-create',
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
          <form [formGroup]="createAnnoForm" #f="ngForm" (ngSubmit)="onCreateAnno()" class="form">
            <mat-card class="anno-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Crear Año</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="number" placeholder="Número del año" formControlName="numero">
                </mat-form-field>

                <mat-checkbox formControlName="habilitado">Habilitado</mat-checkbox>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!createAnnoForm.valid" aria-label="createAnno">
                  <mat-icon>add</mat-icon>
                  <span>Año</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/year" routerLinkActive type="button" aria-label="annosList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de años</span>
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
export class AnnoCreateComponent implements OnInit {

  createAnnoForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.createAnnoForm = this.formBuilder.group({
      numero: ['', Validators.required],
      habilitado: [''],
    });
  }

  onCreateAnno(): void {

    this.loading = true;

    if (this.createAnnoForm.valid) {

      this.createAnnoForm.disable();
      this.apollo.mutate({
        mutation: createAnno,
        variables: {
          data: {
            'numero': this.createAnnoForm.value.numero,
            'habilitado': this.createAnnoForm.value.habilitado || false,
          }
        }
      }).subscribe(( {data} ) => {
        this.loading = false;
        this.createAnnoForm.enable();

        if (data) {
          this.snackBar.open(`Año ${data.createAnno.numero} creado correctamente`, 'X', {duration: 3000});
          this.router.navigate(['admin', 'year']);
        }
      }, (error) => {
        this.loading = false;
        this.createAnnoForm.enable();
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
