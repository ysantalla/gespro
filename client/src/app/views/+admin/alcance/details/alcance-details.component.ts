import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Alcance} from '@app/graphql/types';

const alcanceQuery = gql`
  query alcance($id: String!) {
    alcance(id: $id) {
      id
      nombre
      valor
    }
  }
`;

@Component({
  selector: 'app-alcance-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="alcance-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles del Alcance de Proyecto</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <div *ngIf="alcanceData">

                <mat-grid-list cols="2" rowHeight="6:1">
                    <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{alcanceData.id}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Nombre:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{alcanceData.nombre}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Valor:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{alcanceData.valor}}</h3></mat-grid-tile>
                </mat-grid-list>
              </div>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/alcance" routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de alcances</span>
              </button>
              <button *ngIf="alcanceData" mat-raised-button color="primary"
                    [routerLink]="['/admin','alcance', 'update', alcanceData.id]" routerLinkActive="active">
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

      mat-chip.alcance {
        margin: 10px;
      }
    `
  ]
})
export class AlcanceDetailsComponent implements OnInit, OnDestroy {
  alcanceData: Alcance.Alcance;
  alcanceId: string;
  loading = false;
  alcanceQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.alcanceId = this.activedRoute.snapshot.params['id'];

    this.loading = true;

    this.alcanceQuerySubscription = this.apollo
      .watchQuery<any>({
        query: alcanceQuery,
        variables: {
          id: this.alcanceId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.alcanceData = data.alcance;
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
    this.alcanceQuerySubscription.unsubscribe();
  }
}
