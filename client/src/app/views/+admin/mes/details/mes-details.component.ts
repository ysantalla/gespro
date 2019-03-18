import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Meses} from '@app/graphql/types';

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
  selector: 'app-mes-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="mes-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles de Mes</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <div *ngIf="mesData">

                <mat-grid-list cols="2" rowHeight="6:1">
                    <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{mesData.id}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Número:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{mesData.nombre}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Habilitado:</h3></mat-grid-tile>
                    <mat-grid-tile><mat-checkbox disabled="true" [checked]="mesData.habilitado"></mat-checkbox></mat-grid-tile>
                </mat-grid-list>
              </div>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/month" routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de meses</span>
              </button>
              <button *ngIf="mesData" mat-raised-button color="primary"
                     [routerLink]="['/admin','month', 'update', mesData.id]" routerLinkActive="active">
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

      mat-chip.mes {
        margin: 10px;
      }
    `
  ]
})
export class MesDetailsComponent implements OnInit, OnDestroy {
  mesData: Meses.Meses;
  mesId: string;
  loading = false;
  mesQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.mesId = this.activedRoute.snapshot.params['id'];

    this.loading = true;

    this.mesQuerySubscription = this.apollo
      .watchQuery<any>({
        query: mesQuery,
        variables: {
          id: this.mesId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.mesData = data.mes;
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
    this.mesQuerySubscription.unsubscribe();
  }
}
