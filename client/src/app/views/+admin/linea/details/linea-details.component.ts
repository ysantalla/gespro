import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Linea} from '@app/graphql/types';

const lineaQuery = gql`
  query linea($id: String!) {
    linea(id: $id) {
      id
      nombre
    }
  }
`;

@Component({
  selector: 'app-linea-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="linea-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles de Linea</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <div *ngIf="lineaData">

                <mat-grid-list cols="2" rowHeight="6:1">
                    <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{lineaData.id}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Nombre:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{lineaData.nombre}}</h3></mat-grid-tile>
                </mat-grid-list>
              </div>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/linea" routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de lineas</span>
              </button>
              <button *ngIf="lineaData" mat-raised-button color="primary" [routerLink]="['/admin','linea', 'update', lineaData.id]" routerLinkActive="active">
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

      mat-chip.linea {
        margin: 10px;
      }
    `
  ]
})
export class LineaDetailsComponent implements OnInit, OnDestroy {
  lineaData: Linea.Linea;
  lineaId: string;
  loading = false;
  lineaQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.lineaId = this.activedRoute.snapshot.params['id'];

    this.loading = true;

    this.lineaQuerySubscription = this.apollo
      .watchQuery<any>({
        query: lineaQuery,
        variables: {
          id: this.lineaId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.lineaData = data.linea;
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
    this.lineaQuerySubscription.unsubscribe();
  }
}
