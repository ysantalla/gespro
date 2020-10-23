import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import gql from 'graphql-tag';
import { Annos, AnnosGQL, Proyecto, ProyectosGQL, Estado, Proyectos, Pago } from '@app/graphql/types';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

interface Report  {
  number: number;
  fullname: string;
  employeeNumber: string;
  pago: any;
  proyecto: any;
}

@Component({
  selector: 'app-pago-report',
  template: `
    <div class='container'>
      <div class='loading'>
        <mat-progress-bar value="indeterminate" *ngIf='loading' color='warn'></mat-progress-bar>
      </div>
    </div>
    <br />
    <div class='container' fxLayout='row' fxLayoutAlign='center center'>
      <div class='item' fxFlex='50%' fxFlex.xs='98%' fxFlex.md='70%'>
        <div class='mat-elevation-z8'>
          <form
            [formGroup]='reportPagoForm'
            #f='ngForm'
            (ngSubmit)='onCreatePago()'
            class='form'
          >
            <mat-toolbar color="primary">
                <h1 class='mat-h1'>Reporte de Pago</h1>
            </mat-toolbar>
            <mat-card class='pago-card'>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Escoja un año" formControlName="anno">
                    <mat-option *ngFor="let i of annos | async" [value]="i">{{i.numero}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Escoja un Semestre" formControlName="semestre">
                    <mat-option value="YEAR">Anual</mat-option>
                    <mat-option value="PS">Primer Semestre</mat-option>
                    <mat-option value="SS">Segundo Semestre</mat-option>
                  </mat-select>
                </mat-form-field>

              </mat-card-content>

              <mat-card-actions>
                <button
                  mat-raised-button
                  color='primary'
                  type='submit'
                  [disabled]='!reportPagoForm.valid'
                  aria-label='reportPago'
                >
                  <mat-icon>description</mat-icon>
                  <span>Reporte</span>
                </button>

                <a
                  mat-raised-button
                  color='accent'
                  [routerLink]="['/dashboard']"
                  routerLinkActive
                  type='button'
                  aria-label='dashboard'
                >
                  <mat-icon>dashboard</mat-icon>
                  <span>Escritorio</span>
                </a>
              </mat-card-actions>
            </mat-card>
          </form>
        </div>
      </div>
    </div>
    <br />
    <div fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="98%">
        <div class="mat-elevation-z8 info loading-shade" *ngIf="report.length == 0;">
          <h1 class="mat-h1">No hay registros</h1>
        </div>
      </div>
    </div>
    <div class='container' fxLayout='row' fxLayoutAlign='center center'>
      <div class='item' fxFlex='98%' fxFlex.xs='100%' fxFlex.md='100%'>
        <div class='mat-elevation-z8' *ngIf="report.length > 0">

        <mat-toolbar color="primary">
          <h2 class='mat-h1'>Filtrado</h2>
          <span class="spacer">
          </span>
          <span>
            Resultados -> ({{report?.length}})
          </span>
        </mat-toolbar>
        <mat-card class='pago-card'>

          <mat-card-content>

          <mat-grid-list cols="7" rowHeight="80px">

            <mat-grid-tile [colspan]="1">
              <h3 class="mat-h3">No.</h3>
            </mat-grid-tile>

            <mat-grid-tile [colspan]="1">
              <h3 class="mat-h3">Nombre de Profesor</h3>
            </mat-grid-tile>

            <mat-grid-tile [colspan]="1">
              <h3 class="mat-h3">Número del Trabajador </h3>
            </mat-grid-tile>

            <mat-grid-tile [colspan]="1">
              <h3 class="mat-h3">Pagos Acumulados por Semestre</h3>
            </mat-grid-tile>

            <mat-grid-tile [colspan]="3">
              <h3 class="mat-h3">Pagos por proyecto</h3>
            </mat-grid-tile>

            <div *ngFor="let r of report">

              <mat-grid-tile [colspan]="1">
                <span>{{r.number}}</span>
              </mat-grid-tile>

              <mat-grid-tile [colspan]="1">
                <span>{{r.fullname}}</span>
              </mat-grid-tile>

              <mat-grid-tile [colspan]="1">
                <span>{{r.employeeNumber}} </span>
              </mat-grid-tile>

              <mat-grid-tile [colspan]="1">
                <span>{{r.pago}} </span>
              </mat-grid-tile>

              <mat-grid-tile [colspan]="3">
                <span>{{r.proyecto | json}} </span>
              </mat-grid-tile>

            </div>

          </mat-grid-list>

          </mat-card-content>

          <mat-card-actions>
            <button [disabled]="report.length === 0"
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
        width: 100%;
      }
      .spacer {
        flex: 1 1 auto;
      }
    `
  ]
})
export class PagoReportComponent implements OnInit, OnDestroy {

  reportPagoForm: FormGroup;
  loading = false;

  username: string;

  annos: Observable<Annos.Annos[]>;
  report: Report[] = [];

  querySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private apollo: Apollo,
    private annosGQL: AnnosGQL,
    private authService: AuthService
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {

    this.username = this.authService.getUser().username;
    this.loading = true;

    this.annos = this.annosGQL.watch(
      {},
      {
        fetchPolicy: 'network-only'
      }
    )
      .valueChanges
      .pipe(
        map(result => {
          this.loading = false;
          return result.data.annos;
        })
      );

    this.reportPagoForm = this.formBuilder.group(
      {
        semestre: [''],
        anno: ['', Validators.required],
      }
    );

  }

  exportarPDF(): void {

    this.loading = true;

    let text = 'Anual';

    if (this.reportPagoForm.value.semestre !== 'YEAR') {
      text = (this.reportPagoForm.value.semestre === 'PS') ? '1er Semestre' : '2do Semestre';
    }

    const dd = {
      info: {
        title: 'Reporte de PAGO',
        subject: 'Reporte de pago por proyectos',
        author: 'Gespro',
        keywords: 'gespro, pdf, report',
        creator: 'Ing. Yasmany Santalla Pereda'
      },
      pageSize: 'A4',
      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'portrait',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 40, 80, 40, 60 ],
      header: {
        columns: [
          {text: 'Reporte de Pago', fontSize: 25, margin: [30, 30, 30, 300], alignment: 'left'},
          {text: `${text}/${this.reportPagoForm.value.anno.numero}`, margin: [30, 30], alignment: 'right'}]
      },
      footer: function(currentPage, pageCount) { return currentPage.toString() + ' de ' + pageCount; },
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [25, '*', 60, 100  ],
            body: [
              [ 'No.', 'Nombre de Profesor', 'No. Trabajador', 'Pagos por Semestre' ],
              ...this.report.map(data => {
                return [data.number, data.fullname, data.employeeNumber, data.pago];
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
            },
            {
              text: 'Aprobado por',
              alignment: 'right',
              margin: 40
            }
          ]
        }
      ]
    };

    pdfMake.createPdf(dd).download();
    this.loading = false;
  }

  onCreatePago(): void {
    this.loading = true;

    if (this.reportPagoForm.valid) {
      this.reportPagoForm.disable();

      const semestreForm = this.reportPagoForm.value.semestre;
      const annoForm = this.reportPagoForm.value.anno;

      let mes = '[ENERO, FEBRERO, MARZO, ABRIL, MAYO, JUNIO, JULIO, AGOSTO, SEPTIEMBRE, OCTUBRE, NOVIEMBRE, DICIEMBRE]';

      if (semestreForm === 'PS') {
        mes = '[ENERO, FEBRERO, MARZO, ABRIL, MAYO, JUNIO]';
      }else if (semestreForm === 'SS') {
        mes = '[JULIO, AGOSTO, SEPTIEMBRE, OCTUBRE, NOVIEMBRE, DICIEMBRE]';
      }

      const pagoReport = gql`
        query users {
          users (orderBy: fullname_ASC)  {
            id
            fullname
            employeeNumber
            email
            integrantes {
              id
              proyecto {
                id
                codigo
                estado
              }
              jefeProyecto
              pagos(where: { mes: {nombre_in: ${mes}}, anno: {numero: ${annoForm.numero}}}) {
                id
                calculo
                mes {
                  id
                  nombre
                }
                anno {
                  id
                  numero
                }
              }
            }
          }
        }
      `;

      this.querySubscription = this.apollo
        .watchQuery<any>({
          query: pagoReport,
          fetchPolicy: 'network-only',
          variables: {}
        })
        .valueChanges.subscribe(
          ({ data, loading }) => {

            this.reportPagoForm.enable();
            let i = 1;

            this.report = [];

            data.users.filter((user: any) => {
              const pagoProyecto: number[] = [];
              const proyecto: any[] = [];
              let flag = false;
              user.integrantes.filter((integrante: any) => {
                if (integrante.proyecto.estado === 'HABILITADO') {
                  flag = true;
                  const pago = this.getPago(integrante.pagos);
                  pagoProyecto.push(pago);
                  proyecto.push({
                    code: integrante.proyecto.codigo,
                    pago: parseFloat(pago.toFixed(1))
                  });
                }
              });

              const sumPay = this.sumPagos(pagoProyecto);
              if (flag && sumPay > 0) {
                this.report.push({
                  number: i++,
                  employeeNumber: user.employeeNumber,
                  fullname: user.fullname,
                  pago: parseFloat(sumPay.toFixed(1)),
                  proyecto: proyecto
                });
              }
            });
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

  sumPagos(pagos: number[]): number {
    if (pagos.length === 0) {
      return 0;
    }
    return (((pagos.sort((a, b) => (a <= b) ? 1 : -1)).slice(0, 2))).reduce((a, b) => a + b);
  }

  getPago(value: any[]): number {
    if (value.length === 0) {
      return 0.0;
    } else if (value.length === 1) {
      return value[0].calculo;
    } else {
      return value.map(x => x.calculo).reduce((a, b) => {
        return a + b;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
