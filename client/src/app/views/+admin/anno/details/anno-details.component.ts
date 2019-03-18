import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Annos} from '@app/graphql/types';

const annoQuery = gql`
  query anno($id: String!) {
    anno(id: $id) {
      id
      numero
      habilitado
    }
  }
`;

@Component({
  selector: 'app-anno-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="anno-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles de Año</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <div *ngIf="annoData">

                <mat-grid-list cols="2" rowHeight="6:1">
                    <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{annoData.id}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Número:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{annoData.numero}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Habilitado:</h3></mat-grid-tile>
                    <mat-grid-tile><mat-checkbox disabled="true" [checked]="annoData.habilitado"></mat-checkbox></mat-grid-tile>
                </mat-grid-list>
              </div>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/year" routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de años</span>
              </button>
              <button *ngIf="annoData" mat-raised-button color="primary"
                     [routerLink]="['/admin','year', 'update', annoData.id]" routerLinkActive="active">
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

      mat-chip.anno {
        margin: 10px;
      }
    `
  ]
})
export class AnnoDetailsComponent implements OnInit, OnDestroy {
  annoData: Annos.Annos;
  annoId: string;
  loading = false;
  annoQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.annoId = this.activedRoute.snapshot.params['id'];

    this.loading = true;

    this.annoQuerySubscription = this.apollo
      .watchQuery<any>({
        query: annoQuery,
        variables: {
          id: this.annoId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.annoData = data.anno;
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
    this.annoQuerySubscription.unsubscribe();
  }
}
