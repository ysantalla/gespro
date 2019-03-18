import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Eje} from '@app/graphql/types';

const ejeQuery = gql`
  query eje($id: String!) {
    eje(id: $id) {
      id
      nombre
    }
  }
`;

@Component({
  selector: 'app-eje-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="eje-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles de Eje</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <div *ngIf="ejeData">

                <mat-grid-list cols="2" rowHeight="6:1">
                    <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{ejeData.id}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Nombre:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{ejeData.nombre}}</h3></mat-grid-tile>
                </mat-grid-list>
              </div>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/eje" routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de ejes</span>
              </button>
              <button *ngIf="ejeData" mat-raised-button color="primary" [routerLink]="['/admin','eje', 'update', ejeData.id]" routerLinkActive="active">
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

      mat-chip.eje {
        margin: 10px;
      }
    `
  ]
})
export class EjeDetailsComponent implements OnInit, OnDestroy {
  ejeData: Eje.Eje;
  ejeId: string;
  loading = false;
  ejeQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.ejeId = this.activedRoute.snapshot.params['id'];

    this.loading = true;

    this.ejeQuerySubscription = this.apollo
      .watchQuery<any>({
        query: ejeQuery,
        variables: {
          id: this.ejeId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.ejeData = data.eje;
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
    this.ejeQuerySubscription.unsubscribe();
  }
}
