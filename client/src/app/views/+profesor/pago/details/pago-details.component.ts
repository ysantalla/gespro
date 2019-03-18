import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Pago} from '@app/graphql/types';

const pagoQuery = gql`
  query pago($id: String!) {
    pago(id: $id) {
      id
      integrante {
        id
        usuario {
          id
          fullname
        }
      }
      mes {
        id
        nombre
      }
      anno {
        id
        numero
      }
      horas
      presencia
      incidencia
      relevancia
      complejidad
      gestion
      vinculacion
      calidad
      significacion
      cumplimiento
      calculo
    }
  }
`;

@Component({
  selector: 'app-pago-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="pago-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles de Pago</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <div *ngIf="pagoData">

                <mat-grid-list cols="2" rowHeight="6:1">
                    <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{pagoData.id}}</h3></mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Integrante:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{pagoData.integrante.usuario.fullname}}</h3></mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Año:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{pagoData.anno.numero}}</h3></mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Mes:</h3></mat-grid-tile>
                    <mat-grid-tile><h3 class="mat-h3"> {{pagoData.mes.nombre}}</h3></mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Horas:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.horas}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Presencia:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.presencia}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Incidencia:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.incidencia}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Relevancia:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.relevancia}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Complejidad:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.complejidad}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Gestión:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.gestion}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Vinculación:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.vinculacion}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Calidad:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.calidad}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Significación:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.significacion}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Cumplimiento:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.cumplimiento}}</h3>
                    </mat-grid-tile>

                    <mat-grid-tile><h3 class="mat-h3">Cálculo:</h3></mat-grid-tile>
                    <mat-grid-tile>
                      <h3 class="mat-h3"> {{pagoData.calculo}}</h3>
                    </mat-grid-tile>

                </mat-grid-list>
              </div>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent"
                [routerLink]="['/profesor','project', projectId, 'integrante', integranteId, 'pagos']"
                  routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de pagos</span>
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

      mat-chip.pago {
        margin: 10px;
      }
    `
  ]
})
export class PagoDetailsComponent implements OnInit, OnDestroy {
  pagoData: Pago.Pago;

  pagoId: string;
  projectId: string;
  integranteId: string;

  loading = false;
  pagoQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.pagoId = this.activedRoute.snapshot.params['pagoId'];
    this.projectId = this.activedRoute.snapshot.params['projectId'];
    this.integranteId = this.activedRoute.snapshot.params['integranteId'];

    this.loading = true;

    this.pagoQuerySubscription = this.apollo
      .watchQuery<any>({
        query: pagoQuery,
        variables: {
          id: this.pagoId
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.pagoData = data.pago;
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
    this.pagoQuerySubscription.unsubscribe();
  }
}
