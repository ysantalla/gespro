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
import { ConfirmComponent } from '@app/shared/confirm/confirm.component';
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

const deletePago = gql`
  mutation deletePago($where: PagoWhereUniqueInput!) {
    deletePago(where: $where) {
      id
    }
  }
`;

const deleteManyPagos = gql`
  mutation deleteManyPagos($where: PagoWhereInput!) {
    deleteManyPagos(where: $where) {
      count
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

      <div fxLayout="row" fxLayoutAlign="center center">
        <div class="item" fxFlex="98%">
          <div class="mat-elevation-z8 info loading-shade" *ngIf="this.dataSource.data.length == 0;">
            <h1 class="mat-h1">No hay registros</h1>
          </div>
        </div>
      </div>

      <div fxLayout="row" class="buttons" fxLayoutAlign="start center">
        <div class="item" fxFlex="15%">
          <a class="create-button" mat-raised-button color="primary"
                    [routerLink]="['/admin','project', projectId, 'integrante', integranteId ,'pago','create']" routerLinkActive="active">
            <mat-icon>add</mat-icon>
            <span>Pago</span>
          </a>
        </div>
        <div class="item" fxFlex="15%">
          <a class="projects" mat-raised-button color="accent"
                    [routerLink]="['/admin','project', projectId, 'integrantes']" routerLinkActive="active">
            <mat-icon>person</mat-icon>
            <span>Integrantes</span>
          </a>
        </div>
      </div>

      <br />

      <div [hidden]="!(this.dataSource.data.length > 0)">

        <div fxLayout="row" fxLayoutAlign="center center">
          <div class="item" fxFlex="98%">

            <div class="mat-elevation-z8">


              <mat-table #table [dataSource]="dataSource" matSort aria-label="Elements">

                <!-- Checkbox Column -->
                <ng-container matColumnDef="select">
                  <mat-header-cell fxFlex="5" *matHeaderCellDef>
                    <mat-checkbox (change)="$event ? masterToggle() : null"
                    [checked]="selection.hasValue() && isAllSelected()" [indeterminate]="selection.hasValue() && !isAllSelected()">
                    </mat-checkbox>
                  </mat-header-cell>
                  <mat-cell fxFlex="5" *matCellDef="let row">
                    <mat-checkbox (click)="$event.stopPropagation()"
                    (change)="$event ? selection.toggle(row) : null" [checked]="selection.isSelected(row)">
                    </mat-checkbox>
                  </mat-cell>
                </ng-container>

                <!-- Mes Column -->
                <ng-container matColumnDef="mes">
                  <mat-header-cell fxFlex="10" *matHeaderCellDef mat-sort-header>Mes</mat-header-cell>
                  <mat-cell fxFlex="10" *matCellDef="let row">{{row.mes.nombre}}</mat-cell>
                </ng-container>

                <!-- Anno Column -->
                <ng-container matColumnDef="anno">
                  <mat-header-cell fxFlex="10" *matHeaderCellDef mat-sort-header>Año</mat-header-cell>
                  <mat-cell fxFlex="10" *matCellDef="let row">{{row.anno.numero}} </mat-cell>
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
                    [routerLink]="['/admin','project', projectId, 'integrante', integranteId, 'pago', 'details', row.id]"
                          routerLinkActive="active">
                      <mat-icon>visibility</mat-icon>
                    </a>
                  </mat-cell>
                </ng-container>

                <!-- Edit Column -->
                <ng-container matColumnDef="edit">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Editar</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    <a mat-icon-button color="primary"
                        [routerLink]="['/admin','project', projectId, 'integrante', integranteId, 'pago', 'update', row.id]"
                      routerLinkActive="active">
                      <mat-icon>mode_edit</mat-icon>
                    </a>
                  </mat-cell>
                </ng-container>

                <!-- delete Column -->
                <ng-container matColumnDef="delete">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Eliminar</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    <a mat-icon-button (click)="onDelete(row)" color="warn"><mat-icon>delete_forever</mat-icon></a>
                  </mat-cell>
                </ng-container>

                <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
              </mat-table>

              <div class="table-footer" fxLayout="row" fxLayout.xs="column" fxLayoutAlign="start center">
                <div  fxFlex="10%">
                  <button  mat-raised-button color="warn" (click)="onDeleteSelected($event)"
                  [disabled]="this.selection.selected.length < 1">
                    <mat-icon>delete_forever</mat-icon>
                    <span>Todos</span>
                  </button>
                </div>
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
export class PagoListComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: MatTableDataSource<Pago.Pago>;

  selection = new SelectionModel<Pago.Pago>(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'integrante', 'mes', 'anno', 'calculo', 'details', 'edit', 'delete'];

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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  onDelete(pago: Pago.Pago): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        message: `¿Está seguro que desea eliminar el pago con id "${pago.id}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apollo.mutate({
          mutation: deletePago,
          variables: {
            where: {
              id: pago.id
            }
          }
        }).subscribe(( {data} ) => {
          this.loading = false;

          if (data) {
            this.dataSource.data = this.dataSource.data.filter(pagos => pagos.id !== pago.id);
            this.snackBar.open(`Pago ${data.deletePago.id} eliminado correctamente`, 'X', {duration: 3000});
          }
        }, (error) => {
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
        });

      }
    });
  }

  onDeleteSelected($event): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        message: `¿Está seguro que desea eliminar los ${this.selection.selected.length} pagos selecionados?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apollo.mutate({
          mutation: deleteManyPagos,
          variables: {
            where: {
              id_in: this.selection.selected.map(data => data.id)
            }
          }
        }).subscribe(( {data} ) => {
          this.loading = false;

          if (data) {
            this.dataSource.data = this.dataSource.data.filter(pago => !this._pagoExist(pago, this.selection.selected));
            this.selection.clear();
            this.snackBar.open(`Los ${data.deleteManyPagos.count} pagos fueron eliminados correctamente`, 'X', {duration: 3000});
          }
        }, (error) => {
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
        });

      }
    });
  }

  private _pagoExist(pago: Pago.Pago, pagos: any): boolean {
    if (pagos.some(data => (data.id === pago.id))) {
      return true;
    }
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
