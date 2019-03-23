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
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import { Proyecto } from '@app/graphql/types';
import { AuthService } from '@app/core/services/auth.service';

const proyectoList = gql`
  query proyectos($where: ProyectoWhereInput) {
    proyectos(where: $where) {
      id
      codigo
      nombre
      inicia
      finaliza
      area {
        id
        nombre
      }
      tipo {
        id
        nombre
      }
      estado
    }
  }
`;


@Component({
  selector: 'app-project-list',
  template: `
    <div class="container">
      <div class="loading">
        <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
      </div>
      <br />

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

              <mat-form-field class="full-width">
                <mat-icon matPrefix>search</mat-icon>
                <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filtrado por código y nombre de proyecto">
              </mat-form-field>

              <mat-table #table [dataSource]="dataSource" matSort aria-label="Elements">

                <!-- Codigo Column -->
                <ng-container matColumnDef="codigo">
                  <mat-header-cell *matHeaderCellDef mat-sort-header>Código</mat-header-cell>
                  <mat-cell *matCellDef="let row">{{row.codigo}}</mat-cell>
                </ng-container>

                <!-- Nombre Column -->
                <ng-container matColumnDef="nombre">
                  <mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</mat-header-cell>
                  <mat-cell *matCellDef="let row">{{row.nombre}}</mat-cell>
                </ng-container>

                <!-- Inicia Column -->
                <ng-container matColumnDef="inicia">
                  <mat-header-cell *matHeaderCellDef mat-sort-header>Inicia</mat-header-cell>
                  <mat-cell *matCellDef="let row">{{row.inicia | date}}</mat-cell>
                </ng-container>

                <!-- Finaliza Column -->
                <ng-container matColumnDef="finaliza">
                  <mat-header-cell *matHeaderCellDef mat-sort-header>Finaliza</mat-header-cell>
                  <mat-cell *matCellDef="let row">{{row.finaliza | date}}</mat-cell>
                </ng-container>

                <!-- Integrantes Column -->
                <ng-container matColumnDef="integrantes">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Integrantes</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    <a mat-icon-button [routerLink]="['/profesor','project', row.id, 'integrantes']" routerLinkActive="active">
                      <mat-icon>person</mat-icon>
                    </a>
                  </mat-cell>
                </ng-container>

                <!-- Details Column -->
                <ng-container matColumnDef="details">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Detalles</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    <a mat-icon-button color="accent" [routerLink]="['/profesor','project', 'details', row.id]" routerLinkActive="active">
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
  styles: [
    `
    .full-width{
      width: 100%;
    }

    .container {
      height: auto;
      min-height auto;
    }

  `
  ]
})
export class ProjectListComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: MatTableDataSource<Proyecto.Proyecto>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'codigo',
    'nombre',
    'inicia',
    'finaliza',
    'integrantes',
    'details',
  ];

  loading: boolean;
  private querySubscription: Subscription;

  username: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {

    this.username = this.authService.getUser().username;

    this.loading = true;

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: proyectoList,
        fetchPolicy: 'network-only',
        variables: {
          where: {
            integrantes_some: {
              usuario: {
                username: this.username
              }
            }
          }
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.loading = loading;

          if (data) {
            this.dataSource.data = data.proyectos;
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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
