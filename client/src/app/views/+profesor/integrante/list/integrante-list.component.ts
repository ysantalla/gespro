import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import gql from 'graphql-tag';

import {Integrante} from '@app/graphql/types';
import { ActivatedRoute } from '@angular/router';


const integranteList = gql`
  query integrantes($where: IntegranteWhereInput) {
    integrantes (where: $where) {
      id
      usuario {
        id
        firstname
        lastname
        fullname
        username
      }
      proyecto {
        id
        codigo
      }
      jefeProyecto
    }
  }
`;

@Component({
  selector: 'app-integrante-list',
  template: `
    <div class="container">
      <div class="loading">
        <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
      </div>
      <br />

      <div fxLayout="row" fxLayoutAlign="center center">
        <div class="item" fxFlex="98%">
          <div class="mat-elevation-z8 info loading-shade" *ngIf="this.dataSource.data.length == 0;">
            <h1 class="mat-h1">No hay registros</h1>
          </div>
        </div>
      </div>

      <div fxLayout="row" class="buttons" fxLayoutAlign="start center">
        <div class="item" fxFlex="15%">
          <a class="projects" mat-raised-button color="accent"
                    [routerLink]="['/profesor','project']" routerLinkActive="active">
            <mat-icon>lightbulb_outline</mat-icon>
            <span>Proyectos</span>
          </a>
        </div>
      </div>

      <br />

      <div [hidden]="!(this.dataSource.data.length > 0)">

        <div fxLayout="row" fxLayoutAlign="center center">
          <div class="item" fxFlex="98%">

            <div class="mat-elevation-z8">

              <mat-table #table [dataSource]="dataSource" matSort aria-label="Elements">

                <!-- Nombre Column -->
                <ng-container matColumnDef="nombre">
                  <mat-header-cell fxFlex="50" *matHeaderCellDef mat-sort-header>Profesor</mat-header-cell>
                  <mat-cell fxFlex="50" *matCellDef="let row">{{row.usuario.firstname}} {{row.usuario.lastname}} </mat-cell>
                </ng-container>

                <!-- Proyecto Column -->
                <ng-container matColumnDef="proyecto">
                  <mat-header-cell fxFlex="24" *matHeaderCellDef mat-sort-header>Proyecto</mat-header-cell>
                  <mat-cell fxFlex="24" *matCellDef="let row">{{row.proyecto.codigo}} </mat-cell>
                </ng-container>

                <!-- Enable Column -->
                <ng-container matColumnDef="jProyecto">
                  <mat-header-cell fxFlex="12" *matHeaderCellDef mat-sort-header>Jefe de Proyecto</mat-header-cell>
                  <mat-cell *matCellDef="let row">

                    <mat-checkbox fxFlex="12" disabled="true" [checked]="row.jefeProyecto"></mat-checkbox>

                  </mat-cell>
                </ng-container>

                <!-- Payment Column -->
                <ng-container matColumnDef="payment">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Pagos</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    <a mat-icon-button color="accent" [routerLink]="['/profesor','project', projectId, 'integrante', row.id, 'pagos']"
                          routerLinkActive="active">


                    <mat-icon>attach_money</mat-icon>
                    </a>
                  </mat-cell>
                </ng-container>

                <!-- Details Column -->
                <ng-container matColumnDef="details">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Detalles</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    <a mat-icon-button color="accent" [routerLink]="['/profesor','project', projectId, 'integrante', 'details', row.id]"
                          routerLinkActive="active">
                      <mat-icon>visibility</mat-icon>
                    </a>
                  </mat-cell>
                </ng-container>

                <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
              </mat-table>

              <div class="table-footer" fxLayout="row" fxLayout.xs="column" fxLayoutAlign="start center">
                <div fxFlex="90%">
                  <div [hidden]="dataSource.data.length <= 50">
                    <mat-paginator #paginator [length]="dataSource.data.length"
                    [pageIndex]="0" [pageSize]="50" [pageSizeOptions]="[50, 100, 200]" showFirstLastButtons>
                    </mat-paginator>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .full-width{
      width: 100%;
    }

    .container {
      height: auto;
      min-height auto;
    }

    .buttons {
      margin-left: 1%;
    }

  `]
})
export class IntegranteListComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: MatTableDataSource<Integrante.Integrante>;

  selection = new SelectionModel<Integrante.Integrante>(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['proyecto', 'nombre', 'jProyecto', 'payment', 'details'];

  loading: boolean;
  private querySubscription: Subscription;

  projectId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private activedRoute: ActivatedRoute,
      ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loading = true;

    this.projectId = this.activedRoute.snapshot.params['projectId'];

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: integranteList,
        fetchPolicy: 'network-only',
        variables: {
          where: {
            proyecto: {
              id: this.projectId
            }
          }
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.loading = loading;

          if (data) {
            this.dataSource.data = data.integrantes;
          }
        },
        error => {
          this.snackBar.open(error, 'X', { duration: 3000 });
        }
      );
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

}
