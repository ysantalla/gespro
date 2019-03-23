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

import {Pago} from '@app/graphql/types';
import { ActivatedRoute } from '@angular/router';


const pagoList = gql`
  query pagos($where: PagoWhereInput, $orderBy: PagoOrderByInput) {
    pagos (where: $where, orderBy: $orderBy) {
      id
      mes {
        id
        nombre
      }
      anno {
        id
        numero
      }
      integrante {
        id
        usuario {
          id
          firstname
          lastname
        }
      }
      calculo
    }
  }
`;


@Component({
  selector: 'app-pago-list',
  template: `
    <div class="container">
      <div class="loading">
        <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
      </div>
      <br />

      <div fxLayout="row" class="buttons" fxLayoutAlign="start center">

        <div class="item" fxFlex="15%">
          <a class="projects" mat-raised-button color="accent"
                    [routerLink]="['/profesor','project', projectId, 'integrantes']" routerLinkActive="active">
            <mat-icon>person</mat-icon>
            <span>Integrantes</span>
          </a>
        </div>
      </div>

      <br />

      <div fxLayout="row" fxLayoutAlign="center center">
        <div class="item" fxFlex="98%">
          <div class="mat-elevation-z8 info loading-shade" *ngIf="this.dataSource.data.length == 0;">
            <h1 class="mat-h1">No hay registros</h1>
          </div>
        </div>
      </div>

      <div [hidden]="!(this.dataSource.data.length > 0)">

        <div fxLayout="row" fxLayoutAlign="center center">
          <div class="item" fxFlex="98%">

            <div class="mat-elevation-z8">


              <mat-table #table [dataSource]="dataSource" matSort aria-label="Elements">

                <!-- Mes Column -->
                <ng-container matColumnDef="mes">
                  <mat-header-cell fxFlex="17" *matHeaderCellDef mat-sort-header>Mes</mat-header-cell>
                  <mat-cell fxFlex="17" *matCellDef="let row">{{row.mes.nombre}}</mat-cell>
                </ng-container>

                <!-- Anno Column -->
                <ng-container matColumnDef="anno">
                  <mat-header-cell fxFlex="17" *matHeaderCellDef mat-sort-header>Año</mat-header-cell>
                  <mat-cell fxFlex="17" *matCellDef="let row">{{row.anno.numero}} </mat-cell>
                </ng-container>

                <!-- Integrante Column -->
                <ng-container matColumnDef="integrante">
                  <mat-header-cell fxFlex="35" *matHeaderCellDef mat-sort-header>Integrante</mat-header-cell>
                  <mat-cell fxFlex="35" *matCellDef="let row">
                    {{row.integrante.usuario.firstname}} {{row.integrante.usuario.lastname}}
                  </mat-cell>
                </ng-container>

                <!-- Calculo Column -->
                <ng-container matColumnDef="calculo">
                  <mat-header-cell fxFlex="15" *matHeaderCellDef mat-sort-header>Pago</mat-header-cell>
                  <mat-cell fxFlex="15" *matCellDef="let row">{{row.calculo}} </mat-cell>
                </ng-container>

                <!-- Details Column -->
                <ng-container matColumnDef="details">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Detalles</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    <a mat-icon-button color="accent"
                    [routerLink]="['/profesor','project', projectId, 'integrante', integranteId, 'pago', 'details', row.id]"
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
                  <div [hidden]="this.dataSource.data.length <= 50">
                    <mat-paginator #paginator [length]="this.dataSource.data.length"
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
export class PagoListComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: MatTableDataSource<Pago.Pago>;

  selection = new SelectionModel<Pago.Pago>(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['integrante', 'mes', 'anno', 'calculo', 'details'];

  loading: boolean;
  private querySubscription: Subscription;

  projectId: string;
  integranteId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loading = true;

    this.projectId = this.activedRoute.snapshot.params['projectId'];
    this.integranteId = this.activedRoute.snapshot.params['integranteId'];

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: pagoList,
        fetchPolicy: 'network-only',
        variables: {
          where: {
            integrante: {
              id: this.integranteId
            }
          },
          orderBy: 'id_DESC'
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.loading = loading;

          if (data) {
            this.dataSource.data = data.pagos;
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
