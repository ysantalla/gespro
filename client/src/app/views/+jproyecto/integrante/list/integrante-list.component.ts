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

const deleteIntegrante = gql`
  mutation deleteIntegrante($where: IntegranteWhereUniqueInput!) {
    deleteIntegrante(where: $where) {
      id
    }
  }
`;

const deleteManyIntegrantes = gql`
  mutation deleteManyIntegrantes($where: IntegranteWhereInput!) {
    deleteManyIntegrantes(where: $where) {
      count
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
        <div class="item" fxFlex="25%">
          <a class="create-button" mat-raised-button color="primary"
                    [routerLink]="['/jproject','project', projectId, 'integrante', 'directory']" routerLinkActive="active">
            <mat-icon>add</mat-icon>
            <span>Profesor al sistema</span>
          </a>
        </div>
        <div class="item" fxFlex="25%">
          <a class="projects" mat-raised-button color="accent"
                    [routerLink]="['/jproject','project']" routerLinkActive="active">
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

                <!-- Nombre Column -->
                <ng-container matColumnDef="nombre">
                  <mat-header-cell fxFlex="40" *matHeaderCellDef mat-sort-header>Profesor</mat-header-cell>
                  <mat-cell fxFlex="40" *matCellDef="let row">{{row.usuario.firstname}} {{row.usuario.lastname}} </mat-cell>
                </ng-container>

                <!-- Proyecto Column -->
                <ng-container matColumnDef="proyecto">
                  <mat-header-cell fxFlex="15" *matHeaderCellDef mat-sort-header>Proyecto</mat-header-cell>
                  <mat-cell fxFlex="15" *matCellDef="let row">{{row.proyecto.codigo}} </mat-cell>
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
                    <a mat-icon-button color="accent" [routerLink]="['/jproject','project', projectId, 'integrante', row.id, 'pagos']"
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
                    <a mat-icon-button color="accent" [routerLink]="['/jproject','project', projectId, 'integrante', 'details', row.id]"
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
                    <a mat-icon-button color="primary" [routerLink]="['/jproject','project', projectId, 'integrante', 'update', row.id]"
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
export class IntegranteListComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: MatTableDataSource<Integrante.Integrante>;

  selection = new SelectionModel<Integrante.Integrante>(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'proyecto', 'nombre', 'jProyecto', 'payment', 'details', 'edit', 'delete'];

  loading: boolean;
  private querySubscription: Subscription;

  projectId: string;

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

  onDelete(integrante: Integrante.Integrante): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        message: `¿Está seguro que desea eliminar el integrante "${integrante.usuario.firstname}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apollo.mutate({
          mutation: deleteIntegrante,
          variables: {
            where: {
              id: integrante.id
            }
          }
        }).subscribe(( {data} ) => {
          this.loading = false;

          if (data) {
            this.dataSource.data = this.dataSource.data.filter(integrantes => integrantes.id !== integrante.id);
            this.snackBar.open(`Integrante ${data.deleteIntegrante.id} eliminado correctamente`, 'X', {duration: 3000});
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
        message: `¿Está seguro que desea eliminar los ${this.selection.selected.length} integrantes selecionados?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apollo.mutate({
          mutation: deleteManyIntegrantes,
          variables: {
            where: {
              id_in: this.selection.selected.map(data => data.id)
            }
          }
        }).subscribe(( {data} ) => {
          this.loading = false;

          if (data) {
            this.dataSource.data = this.dataSource.data.filter(integrante => !this._integranteExist(integrante, this.selection.selected));
            this.selection.clear();
            this.snackBar.open(`Los
                 ${data.deleteManyIntegrantes.count} integrantes fueron eliminados correctamente`, 'X', {duration: 3000});
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

  private _integranteExist(integrante: Integrante.Integrante, integrantes: any): boolean {
    if (integrantes.some(data => (data.id === integrante.id))) {
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
