import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Tipo} from '@app/graphql/types';

const tipoQuery = gql`
  query tipo($id: String!) {
    tipo(id: $id) {
      id
      nombre
    }
  }
`;

@Component({
  selector: 'app-tipo-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="tipo-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles del Tipo de Proyecto</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <div *ngIf="tipoData">

                <mat-grid-list cols="2" rowHeight="6:1">
                    <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{tipoData.id}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Nombre:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{tipoData.nombre}}</h3></mat-grid-tile>
                </mat-grid-list>
              </div>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/type" routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de tipos</span>
              </button>
              <button *ngIf="tipoData" mat-raised-button color="primary" [routerLink]="['/admin','type', 'update', tipoData.id]" routerLinkActive="active">
                <mat-icon>mode_edit</mat-icon>
                <span>Editar</span>
              </button>
            </mat-card-actions>
          </mat-card>

        </div>
      </div>
    </div>

  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }

      mat-chip.tipo {
        margin: 10px;
      }
    `
  ]
})
export class TipoDetailsComponent implements OnInit, OnDestroy {
  tipoData: Tipo.Tipo;
  tipoId: string;
  loading = false;
  tipoQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.tipoId = this.activedRoute.snapshot.params['id'];

    this.loading = true;

    this.tipoQuerySubscription = this.apollo
      .watchQuery<any>({
        query: tipoQuery,
        variables: {
          id: this.tipoId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.tipoData = data.tipo;
            this.loading = false;
          }
        },
        error => {
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
        }
      );
  }

  ngOnDestroy(): void {
    this.tipoQuerySubscription.unsubscribe();
  }
}
