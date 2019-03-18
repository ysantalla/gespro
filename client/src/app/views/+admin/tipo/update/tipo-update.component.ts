import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Tipo} from '@app/graphql/types';

const updateTipo = gql`
  mutation updateTipo($data: TipoUpdateInput!, $where: TipoWhereUniqueInput!) {
    updateTipo(data: $data, where: $where) {
      id
      nombre
    }
  }
`;

const tipoQuery = gql`
  query tipo($id: String!) {
    tipo(id: $id) {
      id
      nombre
    }
  }
`;


@Component({
  selector: 'app-tipo-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateTipoForm" #f="ngForm" (ngSubmit)="onUpdateTipo()" class="form">
            <mat-card class="tipo-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar el Tipo de Proyecto</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre" formControlName="nombre">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateTipoForm.valid" aria-label="updateTipo">
                  <mat-icon>mode_edit</mat-icon>
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
  styles: [
    `
      .full-width {
        width: 100%;
      }
    `
  ]
})
export class TipoUpdateComponent implements OnInit, OnDestroy {
  updateTipoForm: FormGroup;
  tipoData: Tipo.Tipo;
  tipoId: string;
  loading = false;
  tipoQuerySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.updateTipoForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });

    this.tipoId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateTipoForm.disable();

    this.tipoQuerySubscription = this.apollo
      .watchQuery<any>({
        query: tipoQuery,
        variables: {
          id: this.tipoId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.tipoData = data.tipo;
          this.updateTipoForm.enable();
          this.loading = false;

          this.updateTipoForm.patchValue({
            nombre: this.tipoData.nombre
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

  onUpdateTipo() {
    this.loading = true;

    if (this.updateTipoForm.valid) {
      this.updateTipoForm.disable();

      this.apollo
        .mutate({
          mutation: updateTipo,
          variables: {
            data:  {
              'nombre': this.updateTipoForm.value.nombre
            },
            where : {
              id: this.tipoId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateTipoForm.enable();

            if (data) {
              this.snackBar.open(
                `Tipo ${
                  data.updateTipo.nombre
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'type']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateTipoForm.enable();
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
    this.tipoQuerySubscription.unsubscribe();
  }
}
