import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Meses} from '@app/graphql/types';

const updateMes = gql`
  mutation updateMes($data: MesUpdateInput!, $where: MesWhereUniqueInput!) {
    updateMes(data: $data, where: $where) {
      id
      nombre
      habilitado
    }
  }
`;

const mesQuery = gql`
  query mes($id: String!) {
    mes(id: $id) {
      id
      nombre
      habilitado
    }
  }
`;


@Component({
  selector: 'app-mes-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateMesForm" #f="ngForm" (ngSubmit)="onUpdateMes()" class="form">
            <mat-card class="mes-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar Mes</h1>
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
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateMesForm.valid" aria-label="updateMes">
                  <mat-icon>mode_edit</mat-icon>
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
  styles: [
    `.full-width {
        width: 100%;
      }
    `
  ]
})
export class MesUpdateComponent implements OnInit, OnDestroy {
  updateMesForm: FormGroup;
  mesData: Meses.Meses;
  mesId: string;
  loading = false;
  mesQuerySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.updateMesForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      habilitado: ['']
    });

    this.mesId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateMesForm.disable();

    this.mesQuerySubscription = this.apollo
      .watchQuery<any>({
        query: mesQuery,
        variables: {
          id: this.mesId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.mesData = data.mes;
          this.updateMesForm.enable();
          this.loading = false;

          this.updateMesForm.patchValue({
            nombre: this.mesData.nombre,
            habilitado: this.mesData.habilitado
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

  onUpdateMes() {
    this.loading = true;

    if (this.updateMesForm.valid) {
      this.updateMesForm.disable();

      this.apollo
        .mutate({
          mutation: updateMes,
          variables: {
            data:  {
              'nombre': this.updateMesForm.value.nombre,
              'habilitado': this.updateMesForm.value.habilitado,
            },
            where : {
              id: this.mesId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateMesForm.enable();

            if (data) {
              this.snackBar.open(
                `Mes ${
                  data.updateMes.nombre
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'month']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateMesForm.enable();
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
    this.mesQuerySubscription.unsubscribe();
  }
}
