import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import { Proyecto } from '@app/graphql/types';

const proyectoQuery = gql`
  query proyecto($id: String!) {
    proyecto(id: $id) {
      id
      nombre
      codigo
      inicia
      finaliza
      estado
      tipo {
        id
        nombre
      }
      eje {
        id
        nombre
      }
      linea {
        id
        nombre
      }
      alcance {
        id
        nombre
        valor
      }
      area {
        id
        nombre
      }
    }
  }
`;

@Component({
  selector: 'app-project-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="98%" fxFlex.xs="98%" fxFlex.md="98%">

        <div class="mat-elevation-z8">
          <mat-card class="proyecto-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles Proyecto</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <mat-grid-list *ngIf="proyectoData" cols="2" rowHeight="9:1">
                <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.id}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Nombre:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.nombre}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Código</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.codigo}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Inicia:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.inicia | date}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Finaliza:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.finaliza | date}}</h3></mat-grid-tile>

                <mat-grid-tile><h3 class="mat-h3">Área a la que pertenece:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.area.nombre}}</h3></mat-grid-tile>

                <mat-grid-tile><h3 class="mat-h3">Línea de investigación:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.linea.nombre}}</h3></mat-grid-tile>

                <mat-grid-tile><h3 class="mat-h3">Eje  estratégico:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.eje.nombre}}</h3></mat-grid-tile>

                <mat-grid-tile><h3 class="mat-h3">Tipo de proyecto</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.tipo.nombre}}</h3></mat-grid-tile>

                <mat-grid-tile><h3 class="mat-h3">Estado del proyecto:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.estado}}</h3></mat-grid-tile>


                <mat-grid-tile><h3 class="mat-h3">Alcance del proyecto:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{proyectoData.alcance.nombre}} --- {{proyectoData.alcance.valor}}</h3></mat-grid-tile>

              </mat-grid-list>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/project" routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de proyectos</span>
              </button>
              <button *ngIf="proyectoData" mat-raised-button color="primary" [routerLink]="['/admin','project', 'update', proyectoData.id]"
                    routerLinkActive="active">
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
    `mat-chip.role {
        margin: 10px;
      }
    `
  ]
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  proyectoData: Proyecto.Proyecto;
  proyectoId: string;
  loading = false;
  proyectoQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.proyectoId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;

    this.proyectoQuerySubscription = this.apollo
      .watchQuery<any>({
        query: proyectoQuery,
        variables: {
          id: this.proyectoId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.proyectoData = data.proyecto;
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
    this.proyectoQuerySubscription.unsubscribe();
  }
}
