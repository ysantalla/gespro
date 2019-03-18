import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Integrante} from '@app/graphql/types';

const integranteQuery = gql`
  query integrante($id: String!) {
    integrante(id: $id) {
      id
      usuario {
        id
        firstname
        lastname
        fullname
      }
      proyecto {
        id
        nombre
      }
      jefeProyecto
    }
  }
`;

@Component({
  selector: 'app-integrante-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="integrante-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles de Integrante</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <div *ngIf="integranteData">

                <mat-grid-list cols="2" rowHeight="6:1">
                    <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{integranteData.id}}</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3">Profesor:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{integranteData.usuario.firstname}} {{integranteData.usuario.lastname}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Proyecto:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{integranteData.proyecto.nombre}} </h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Jefe de Proyecto:</h3></mat-grid-tile>

                    <mat-grid-tile><mat-checkbox disabled="true" [checked]="integranteData.jefeProyecto"></mat-checkbox></mat-grid-tile>

                </mat-grid-list>
              </div>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" [routerLink]="['/profesor','project', projectId, 'integrantes']"
                  routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de integrantes</span>
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

      mat-chip.integrante {
        margin: 10px;
      }
    `
  ]
})
export class IntegranteDetailsComponent implements OnInit, OnDestroy {
  integranteData: Integrante.Integrante;
  integranteId: string;
  projectId: string;
  loading = false;
  integranteQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.integranteId = this.activedRoute.snapshot.params['integranteId'];
    this.projectId = this.activedRoute.snapshot.params['projectId'];

    this.loading = true;

    this.integranteQuerySubscription = this.apollo
      .watchQuery<any>({
        query: integranteQuery,
        variables: {
          id: this.integranteId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.integranteData = data.integrante;
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
    this.integranteQuerySubscription.unsubscribe();
  }
}
