import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import gql from 'graphql-tag';
import { Proyecto, Tipo, Area, Ejes, Lineas, Alcance, TiposGQL, AreasGQL, LineasGQL, EjesGQL, AlcancesGQL } from '@app/graphql/types';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


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
      alcance {
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
      estado
      integrantes {
        id
      }
    }
  }
`;

@Component({
  selector: 'app-proyecto-report',
  template: `
    <div class='container'>
      <div class='loading'>
        <mat-progress-bar value="indeterminate" *ngIf='loading' color='warn'></mat-progress-bar>
      </div>
    </div>
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="98%" fxFlex.xs="100%" fxFlex.md="100%">

        <div class="mat-elevation-z8">
          <mat-toolbar color="primary">
            <h1 class="mat-h1">Reporte de Proyecto</h1>
          </mat-toolbar>
          <form [formGroup]="reportPagoForm" #f="ngForm" (ngSubmit)="onProjectReport()" class="form">
            <mat-card class="proyecto-card">

              <mat-card-content>

                <mat-form-field class="full-width form-control">
                  <input matInput type="text" placeholder="Nombre de proyecto" formControlName="nombre">
                </mat-form-field>

                <mat-form-field class="half-width form-control">
                  <input matInput type="text" placeholder="Código de proyecto" formControlName="codigo">
                </mat-form-field>

                <mat-form-field class="short-width form-control">
                  <input matInput [matDatepicker]="pickerInit" formControlName="inicia" placeholder="Fecha de inicio del proyeto">
                  <mat-datepicker-toggle matSuffix [for]="pickerInit"></mat-datepicker-toggle>
                  <mat-datepicker #pickerInit disabled="false"></mat-datepicker>
                </mat-form-field>

                <mat-form-field class="short-width form-control">
                  <input matInput [matDatepicker]="pickerOver" formControlName="finaliza" placeholder="Fecha de fin del proyeto">
                  <mat-datepicker-toggle matSuffix [for]="pickerOver"></mat-datepicker-toggle>
                  <mat-datepicker #pickerOver disabled="false"></mat-datepicker>
                </mat-form-field>

                <mat-form-field class="short-width form-control">
                  <mat-select placeholder="Tipo" formControlName="tipo">
                    <mat-option *ngFor="let type of types | async" [value]="type">{{type.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="short-width form-control">
                  <mat-select placeholder="Area" formControlName="area">
                    <mat-option *ngFor="let area of areas | async" [value]="area">{{area.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="short-width form-control">
                  <mat-select placeholder="Línea de Investigación" formControlName="linea">
                    <mat-option *ngFor="let linea of lineas | async" [value]="linea">{{linea.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="short-width form-control">
                  <mat-select placeholder="Ejes estratégicos" formControlName="eje">
                    <mat-option *ngFor="let eje of ejes | async" [value]="eje">{{eje.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="short-width form-control">
                  <mat-select placeholder="Alcance" formControlName="alcance">
                    <mat-option *ngFor="let alcance of alcances | async" [value]="alcance">
                      <{{alcance.nombre}} --- {{alcance.valor}}>
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="short-width form-control">
                  <mat-select placeholder="Estado del Proyecto" formControlName="estado">
                    <mat-option value="CREADO">CREADO</mat-option>
                    <mat-option value="HABILITADO">HABILITADO</mat-option>
                    <mat-option value="CERRADO">CERRADO</mat-option>
                  </mat-select>
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!reportPagoForm.valid" aria-label="report">
                  <mat-icon>description</mat-icon>
                  <span>Proyecto</span>
                </button>

                <button mat-raised-button color="accent"
                      routerLink="/admin/project" routerLinkActive type="button" aria-label="proyectosList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de Proyectos</span>
                </button>
              </mat-card-actions>
            </mat-card>
          </form>
        </div>
      </div>
    </div>
    <br />
    <div fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="98%">
        <div class="mat-elevation-z8 info loading-shade" *ngIf="proyecto?.length == 0;">
          <h1 class="mat-h1">No hay registros</h1>
        </div>
      </div>
    </div>
    <div class='container' fxLayout='row' fxLayoutAlign='center center'>
      <div class='item' fxFlex='98%' fxFlex.xs='100%' fxFlex.md='100%'>
        <div class='mat-elevation-z8' *ngIf="proyecto?.length > 0">

        <mat-toolbar color="primary">
          <h2 class='mat-h1'>Filtrado</h2>
          <span class="spacer">
          </span>
          <span>
            Resultados -> ({{proyecto?.length}})
          </span>
        </mat-toolbar>
        <mat-card class='pago-card'>

          <mat-card-content>

          <mat-table #table [dataSource]="proyecto" matSort aria-label="Elements">

                <!-- Codigo Column -->
                <ng-container matColumnDef="codigo">
                  <mat-header-cell fxFlex="6" *matHeaderCellDef >Código</mat-header-cell>
                  <mat-cell fxFlex="6" *matCellDef="let row">{{row.codigo}}</mat-cell>
                </ng-container>

                <!-- Nombre Column -->
                <ng-container matColumnDef="nombre">
                  <mat-header-cell *matHeaderCellDef >Nombre</mat-header-cell>
                  <mat-cell *matCellDef="let row">{{row.nombre}}</mat-cell>
                </ng-container>

                <!-- Inicia Column -->
                <ng-container matColumnDef="inicia">
                  <mat-header-cell fxFlex="6" *matHeaderCellDef >Inicia</mat-header-cell>
                  <mat-cell fxFlex="6" *matCellDef="let row">{{row.inicia | date}}</mat-cell>
                </ng-container>

                <!-- Finaliza Column -->
                <ng-container matColumnDef="finaliza">
                  <mat-header-cell fxFlex="6" *matHeaderCellDef >Finaliza</mat-header-cell>
                  <mat-cell fxFlex="6" *matCellDef="let row">{{row.finaliza | date}}</mat-cell>
                </ng-container>

                <ng-container matColumnDef="area">
                  <mat-header-cell fxFlex="6" *matHeaderCellDef >Area</mat-header-cell>
                  <mat-cell fxFlex="6" *matCellDef="let row">{{row.area.nombre}}</mat-cell>
                </ng-container>
                <ng-container matColumnDef="tipo">
                  <mat-header-cell fxFlex="6" *matHeaderCellDef >Tipo</mat-header-cell>
                  <mat-cell fxFlex="6" *matCellDef="let row">{{row.tipo.nombre}}</mat-cell>
                </ng-container>
                <ng-container matColumnDef="alcance">
                  <mat-header-cell fxFlex="6" *matHeaderCellDef >Alcance</mat-header-cell>
                  <mat-cell fxFlex="6" *matCellDef="let row">{{row.alcance.nombre}}</mat-cell>
                </ng-container>
                <ng-container matColumnDef="eje">
                  <mat-header-cell fxFlex="6" *matHeaderCellDef >Eje</mat-header-cell>
                  <mat-cell fxFlex="6" *matCellDef="let row">{{row.eje.nombre}}</mat-cell>
                </ng-container>
                <ng-container matColumnDef="linea">
                  <mat-header-cell fxFlex="6" *matHeaderCellDef >Linea</mat-header-cell>
                  <mat-cell fxFlex="6" *matCellDef="let row">{{row.linea.nombre}}</mat-cell>
                </ng-container>

                <!-- Integrantes Column -->
                <ng-container matColumnDef="integrantes">
                  <mat-header-cell fxFlex="7" *matHeaderCellDef>
                    <span>Integrantes</span>
                  </mat-header-cell>
                  <mat-cell fxFlex="7" *matCellDef="let row">
                    {{row.integrantes.length}}
                  </mat-cell>
                </ng-container>

                <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
              </mat-table>

          </mat-card-content>

          <mat-card-actions>
            <button [disabled]="proyecto?.length === 0"
              mat-raised-button
              color='primary'
              (click)="exportarPDF()"
              aria-label='reportPago'
            >
              <mat-icon>description</mat-icon>
              <span>Exportar PDF</span>
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
        width: 85%;
      }
      .half-width {
        width: 13%;
      }
      .short-width {
        width: 24%;
      }
      .spacer {
        flex: 1 1 auto;
      }

      .form-control {
        margin-left: 5px;
      }
    `
  ]
})
export class ProyectoReportComponent implements OnInit, OnDestroy {

  reportPagoForm: FormGroup;
  loading = false;

  dataSource: MatTableDataSource<Proyecto.Proyecto>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'codigo',
    'nombre',
    'inicia',
    'finaliza',
    'area',
    'tipo',
    'alcance',
    'eje',
    'linea',
    'integrantes',
  ];

  querySubscription: Subscription;

  types: Observable<Tipo.Tipo[]>;
  areas: Observable<Area.Area[]>;

  ejes: Observable<Ejes.Ejes[]>;
  lineas: Observable<Lineas.Lineas[]>;

  alcances: Observable<Alcance.Alcance[]>;

  proyecto: Proyecto.Proyecto[] = [];
  whereSearch = '';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private apollo: Apollo,
    private tiposGQL: TiposGQL,
    private areasGQL: AreasGQL,
    private lineasGQL: LineasGQL,
    private ejesGQL: EjesGQL,
    private alcancesGQL: AlcancesGQL
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {

    this.reportPagoForm = this.formBuilder.group(
      {
        nombre: [''],
        codigo: [''],
        inicia: [''],
        finaliza: [''],
        estado: [''],
        tipo: [''],
        area: [''],
        eje: [''],
        linea: [''],
        alcance: [''],
      }
    );

    this.areas = this.areasGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.areas)
      );

      this.lineas = this.lineasGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.lineas)
      );

      this.ejes = this.ejesGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.ejes)
      );

    this.alcances = this.alcancesGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.alcances)
      );

    this.types = this.tiposGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.tipos)
      );

  }

  exportarPDF(): void {

    this.loading = true;

    const dd = {
      info: {
        title: 'Reporte de Proyecto',
        subject: 'Reporte de pago por proyectos',
        author: 'Gespro',
        keywords: 'gespro, pdf, report',
        creator: 'Ing. Yasmany Santalla Pereda'
      },
      pageSize: 'A4',
      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'landscape',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 15, 80, 40, 15 ],
      header: {
        columns: [
          {text: 'Reporte de Proyecto', fontSize: 25, margin: [30, 30, 30, 300], alignment: 'left'},
          ]
      },
      footer: function(currentPage, pageCount) { return currentPage.toString() + ' de ' + pageCount; },
      content: [

        {
          text: `Patrón de filtrado -> ${this.whereSearch}`, style: {italics: true}, margin: 10
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [40, '*', 50, 65, 65, 50, 50, 50, 50, 55, 50  ],
            body: [
              [ 'Código', 'Nombre', 'Alcance', 'Inicia', 'Finaliza', 'Área', 'Eje', 'Línea', 'Tipo', 'Estado', 'Integrantes'],
              ...this.proyecto.map(data => {

                return [data.codigo, data.nombre, data.alcance.nombre, data.inicia.toString().split('T0')[0],
                  data.finaliza.toString().split('T0')[0], data.area.nombre,
                  data.eje.nombre, data.linea.nombre, data.tipo.nombre, data.estado, data.integrantes.length];
              })
            ]
          }
        },
        {
          columns: [
            {
              text: 'Elaborado por',
              alignment: 'left',
              margin: 40
            }
          ]
        }
      ]
    };

    pdfMake.createPdf(dd).download();
    this.loading = false;
  }

  onProjectReport(): void {
    this.loading = true;

    if (this.reportPagoForm.valid) {
      this.reportPagoForm.disable();

      const where = {};

      this.whereSearch = '';

      if (this.reportPagoForm.value.nombre) {
        where['nombre_contains'] = this.reportPagoForm.value.nombre;
        this.whereSearch = `nombre contiene ${this.reportPagoForm.value.nombre}, `;
      }

      if (this.reportPagoForm.value.codigo) {
        where['codigo_contains'] = this.reportPagoForm.value.codigo;
        this.whereSearch += `código contiene ${this.reportPagoForm.value.codigo}, `;
      }

      if (this.reportPagoForm.value.inicia) {
        where['inicia_gte'] = this.reportPagoForm.value.inicia;
        this.whereSearch += `inicio del proyecto >=  ${this.reportPagoForm.value.codigo}, `;
      }

      if (this.reportPagoForm.value.finaliza) {
        where['finaliza_lte'] = this.reportPagoForm.value.finaliza;
        this.whereSearch += `final del proyecto =<  ${this.reportPagoForm.value.codigo}, `;
      }

      if (this.reportPagoForm.value.tipo) {
        where['tipo'] = {id: this.reportPagoForm.value.tipo.id};
        this.whereSearch += `tipo proyecto ${this.reportPagoForm.value.tipo.nombre}, `;
      }

      if (this.reportPagoForm.value.area) {
        where['area'] = {id: this.reportPagoForm.value.area.id};
        this.whereSearch += `área del proyecto ${this.reportPagoForm.value.area.nombre}, `;
      }

      if (this.reportPagoForm.value.eje) {
        where['eje'] = {id: this.reportPagoForm.value.eje.id};
        this.whereSearch += `eje del proyecto ${this.reportPagoForm.value.eje.nombre}, `;
      }

      if (this.reportPagoForm.value.linea) {
        where['linea'] = {id: this.reportPagoForm.value.linea.id};
        this.whereSearch += `linea del proyecto ${this.reportPagoForm.value.linea.nombre}, `;
      }

      if (this.reportPagoForm.value.alcance) {
        where['alcance'] = {id: this.reportPagoForm.value.alcance.id};
        this.whereSearch += `alcance del proyecto ${this.reportPagoForm.value.alcance.nombre}, `;
      }

      if (this.reportPagoForm.value.estado) {
        where['estado'] = this.reportPagoForm.value.estado;
        this.whereSearch += `estado del proyecto ${this.reportPagoForm.value.estado}, `;
      }

      this.querySubscription = this.apollo
        .watchQuery<any>({
          query: proyectoList,
          fetchPolicy: 'network-only',
          variables: {
            where: where
          }
        })
        .valueChanges.subscribe(
          ({ data, loading }) => {

            this.reportPagoForm.enable();
            this.proyecto = [];

            if (data.proyectos) {
              this.proyecto = data.proyectos;
            }

            this.loading = loading;
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
    } else {
      console.log('Form not valid');
    }
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
