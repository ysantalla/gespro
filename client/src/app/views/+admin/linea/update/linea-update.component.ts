import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Linea} from '@app/graphql/types';

const updateLinea = gql`
  mutation updateLinea($data: LineaUpdateInput!, $where: LineaWhereUniqueInput!) {
    updateLinea(data: $data, where: $where) {
      id
      nombre
    }
  }
`;

const lineaQuery = gql`
  query linea($id: String!) {
    linea(id: $id) {
      id
      nombre
    }
  }
`;


@Component({
  selector: 'app-linea-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateLineaForm" #f="ngForm" (ngSubmit)="onUpdateLinea()" class="form">
            <mat-card class="linea-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar Linea</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre" formControlName="nombre">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateLineaForm.valid" aria-label="updateLinea">
                  <mat-icon>mode_edit</mat-icon>
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
  styles: [
    `
      .full-width {
        width: 100%;
      }
    `
  ]
})
export class LineaUpdateComponent implements OnInit, OnDestroy {
  updateLineaForm: FormGroup;
  lineaData: Linea.Linea;
  lineaId: string;
  loading = false;
  lineaQuerySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.updateLineaForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });

    this.lineaId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateLineaForm.disable();

    this.lineaQuerySubscription = this.apollo
      .watchQuery<any>({
        query: lineaQuery,
        variables: {
          id: this.lineaId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.lineaData = data.linea;
          this.updateLineaForm.enable();
          this.loading = false;

          this.updateLineaForm.patchValue({
            nombre: this.lineaData.nombre
          });
        }
      }, (error) => {
        this.loading = false;
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
  }

  onUpdateLinea() {
    this.loading = true;

    if (this.updateLineaForm.valid) {
      this.updateLineaForm.disable();

      this.apollo
        .mutate({
          mutation: updateLinea,
          variables: {
            data:  {
              'nombre': this.updateLineaForm.value.nombre
            },
            where : {
              id: this.lineaId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateLineaForm.enable();

            if (data) {
              this.snackBar.open(
                `Linea ${
                  data.updateLinea.nombre
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'linea']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateLineaForm.enable();
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
          }
        );
    } else {
      console.log('Form not valid');
    }
  }

  ngOnDestroy(): void {
    this.lineaQuerySubscription.unsubscribe();
  }
}
