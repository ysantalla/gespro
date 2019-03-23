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

import {Annos} from '@app/graphql/types';


const annoList = gql`
  query annos {
    annos {
      id
      numero
      habilitado
    }
  }
`;

const deleteAnno = gql`
  mutation deleteAnno($where: AnnoWhereUniqueInput!) {
    deleteAnno(where: $where) {
      numero
    }
  }
`;

const deleteManyAnnos = gql`
  mutation deleteManyAnnoes($where: AnnoWhereInput!) {
    deleteManyAnnoes(where: $where) {
      count
    }
  }
`;

@Component({
  selector: 'app-anno-list',
  template: `
    <div class="container">
      <div class="loading">
        <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
      </div>
      <br />

      <div fxLayout="row" fxLayoutAlign="center center">
        <div class="item" fxFlex="98%">
          <button class="create-button" mat-raised-button color="primary" routerLink="/admin/year/create" routerLinkActive="active">
            <mat-icon>add</mat-icon>
            <span>Año</span>
          </button>
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

              <mat-form-field class="full-width">
                <mat-icon matPrefix>search</mat-icon>
                <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filtrado por número">
              </mat-form-field>

              <mat-table #table [dataSource]="dataSource" matSort aria-label="Elements">

                <!-- Checkbox Column -->
                <ng-container matColumnDef="select">
                  <mat-header-cell fxFlex="10" *matHeaderCellDef>
                    <mat-checkbox (change)="$event ? masterToggle() : null"
                    [checked]="selection.hasValue() && isAllSelected()" [indeterminate]="selection.hasValue() && !isAllSelected()">
                    </mat-checkbox>
                  </mat-header-cell>
                  <mat-cell fxFlex="10" *matCellDef="let row">
                    <mat-checkbox (click)="$event.stopPropagation()"
                    (change)="$event ? selection.toggle(row) : null" [checked]="selection.isSelected(row)">
                    </mat-checkbox>
                  </mat-cell>
                </ng-container>

                <!-- Number Column -->
                <ng-container matColumnDef="numero">
                  <mat-header-cell fxFlex="49" *matHeaderCellDef mat-sort-header>Número</mat-header-cell>
                  <mat-cell fxFlex="49" *matCellDef="let row">{{row.numero}}</mat-cell>
                </ng-container>

                <!-- Enable Column -->
                <ng-container matColumnDef="habilitado">
                  <mat-header-cell fxFlex="20" *matHeaderCellDef mat-sort-header>Habilitado</mat-header-cell>
                  <mat-cell *matCellDef="let row">

                    <mat-checkbox fxFlex="20" disabled="true" [checked]="row.habilitado"></mat-checkbox>

                  </mat-cell>
                </ng-container>

                <!-- Details Column -->
                <ng-container matColumnDef="details">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Detalles</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    <a mat-icon-button color="accent" [routerLink]="['/admin','year', 'details', row.id]" routerLinkActive="active">
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
                    <a mat-icon-button color="primary" [routerLink]="['/admin','year', 'update', row.id]" routerLinkActive="active">
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

  `]
})
export class AnnoListComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource: MatTableDataSource<Annos.Annos>;

  selection = new SelectionModel<Annos.Annos>(true, []);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'numero', 'habilitado', 'details', 'edit', 'delete'];

  loading: boolean;
  private querySubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loading = true;

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: annoList,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.loading = loading;

          if (data) {
            this.dataSource.data = data.annos;
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

  onDelete(anno: Annos.Annos): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        message: `¿Está seguro que desea eliminar el anno "${anno.numero}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apollo.mutate({
          mutation: deleteAnno,
          variables: {
            where: {
              id: anno.id
            }
          }
        }).subscribe(( {data} ) => {
          this.loading = false;

          if (data) {
            this.dataSource.data = this.dataSource.data.filter(annos => annos.id !== anno.id);
            this.snackBar.open(`Año ${data.deleteAnno.numero} eliminado correctamente`, 'X', {duration: 3000});
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
        message: `¿Está seguro que desea eliminar los ${this.selection.selected.length} años selecionados?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apollo.mutate({
          mutation: deleteManyAnnos,
          variables: {
            where: {
              id_in: this.selection.selected.map(data => data.id)
            }
          }
        }).subscribe(( {data} ) => {
          this.loading = false;

          if (data) {
            this.dataSource.data = this.dataSource.data.filter(anno => !this._annoExist(anno, this.selection.selected));
            this.selection.clear();
            this.snackBar.open(`Los ${data.deleteManyAnnoes.count} años fueron eliminados correctamente`, 'X', {duration: 3000});
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

  private _annoExist(anno: Annos.Annos, annos: any): boolean {
    if (annos.some(data => (data.id === anno.id))) {
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
