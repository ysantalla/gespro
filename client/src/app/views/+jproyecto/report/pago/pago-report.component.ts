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
                    <mat-option value="PS">Primer Semestre</mat-option>
                    <mat-option value="SS">Segundo Semestre</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Mis proyectos" formControlName="proyecto">
                    <mat-option *ngFor="let i of proyectos | async" [value]="i">{{i.codigo}} --- {{i.nombre}}</mat-option>
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

    <div class='container' fxLayout='row' fxLayoutAlign='center center'>
      <div class='item' fxFlex='98%' fxFlex.xs='100%' fxFlex.md='100%'>
        <div class='mat-elevation-z8' *ngFor="let p of reporte">

        <mat-toolbar color="primary">
          <h2 class='mat-h1'>Reporte de Pago</h2>
        </mat-toolbar>
        <mat-card class='pago-card'>

          <mat-card-title>
            <h2 class="mat-h2">Código del Proyecto: {{p.codigo}}</h2>
          </mat-card-title>

          <mat-card-content>

          <mat-grid-list cols="4" rowHeight="40px">

            <mat-grid-tile>
              <h3 class="mat-h3">No.</h3>
            </mat-grid-tile>

            <mat-grid-tile>
              <h3 class="mat-h3">Nombre de Profesor</h3>
            </mat-grid-tile>

            <mat-grid-tile>
              <h3 class="mat-h3">Número del Trabajador </h3>
            </mat-grid-tile>

            <mat-grid-tile>
              <h3 class="mat-h3">Pagos Acumulados por Semestre</h3>
            </mat-grid-tile>

            <div *ngFor="let integrante of p?.integrantes; let i = index">

              <mat-grid-tile>
                <span>{{i + 1}}</span>
              </mat-grid-tile>

              <mat-grid-tile>
                <span>{{integrante.usuario.fullname}}</span>
              </mat-grid-tile>

              <mat-grid-tile>
                <span>{{integrante.usuario.employeeNumber}} </span>
              </mat-grid-tile>

              <mat-grid-tile>
                <span>{{integrante.pagos | pago}} </span>
              </mat-grid-tile>

            </div>

          </mat-grid-list>

          </mat-card-content>

          <mat-card-actions>
            <button [disabled]="p?.integrantes.length === 0"
              mat-raised-button
              color='primary'
              (click)="exportarPDF(reporte)"
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
    `
  ]
})
export class PagoReportComponent implements OnInit, OnDestroy {

  reportPagoForm: FormGroup;
  loading = false;

  username: string;

  annos: Observable<Annos.Annos[]>;
  proyectos: Observable<Proyectos.Proyectos[]>;
  reporte: Proyecto.Proyecto[];

  querySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private apollo: Apollo,
    private annosGQL: AnnosGQL,
    private proyectosGQL: ProyectosGQL,
    private authService: AuthService
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {

    this.username = this.authService.getUser().username;
    this.loading = true;

    this.proyectos = this.proyectosGQL.watch(
      {
        where: {
          integrantes_some: {
            usuario: {
              username: this.username,
            },
            jefeProyecto: true
          },
          estado: Estado.Habilitado
        }
      },
      {
        fetchPolicy: 'network-only'
      }
    ).valueChanges
      .pipe(
        map(result => result.data.proyectos)
      );

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
        semestre: ['', Validators.required],
        anno: ['', Validators.required],
        proyecto: ['', Validators.required],
      }
    );

  }

  exportarPDF(proyecto: Proyecto.Proyecto[]): void {

    const rows: any[] = [];
    let i = 1;
    const semestre = (this.reportPagoForm.value.semestre === 'PS') ? '1er Semestre' : '2do Semestre';
    this.loading = true;

    proyecto.map(data => {
      data.integrantes.map(integrante => {
        const sumPay = this.getPago(integrante.pagos);
        if (sumPay > 0) {
          rows.push([
            i++,
            integrante.usuario.fullname,
            integrante.usuario.employeeNumber,
            sumPay
          ]);
        }
      });
    });

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
      pageMargins: [ 40, 60, 40, 60 ],
      header: {
          columns: [
            {text: 'Reporte de Pago', fontSize: 25, margin: [30, 30, 30, 300], alignment: 'left'},
            {text: `${semestre}/${this.reportPagoForm.value.anno.numero}`, margin: [30, 30], alignment: 'right'}],
      },
      footer: function(currentPage, pageCount) { return currentPage.toString() + ' de ' + pageCount; },
      content: [
        {
          text: `"${proyecto[0].nombre}"`, style: {italics: true}, margin: 10
        },
        {
          text: `Código: "${proyecto[0].codigo}"`, style: {italics: true}, margin: 10
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [25, '*', 60, 100  ],
            body: [
              [ 'No.', 'Nombre de Profesor', 'No. Trabajador', 'Pagos por Semestre' ],
              ...rows
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
      const proyecto = this.reportPagoForm.value.proyecto;

      let mes = '[ENERO, FEBRERO, MARZO, ABRIL, MAYO, JUNIO]';

      if (semestreForm === 'SS') {
        mes = '[JULIO, AGOSTO, SEPTIEMBRE, OCTUBRE, NOVIEMBRE, DICIEMBRE]';
      }

      const pagoReport = gql`
        query proyectos($where: ProyectoWhereInput) {
          proyectos(where: $where) {
            codigo
            estado
            nombre
            id
            integrantes {
              jefeProyecto
              usuario {
                fullname
                employeeNumber
              }
              pagos (where: {mes: {nombre_in: ${mes}}, anno: {numero: ${annoForm.numero}}}) {
                calculo
                mes {
                  nombre
                }
                anno {
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
          variables: {
            where: {
              id: proyecto.id
            }
          }
        })
        .valueChanges.subscribe(
          ({ data, loading }) => {
            this.loading = loading;

            this.reportPagoForm.enable();
            this.reporte = data.proyectos;

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

  getPago(value: any[]): number {
    if (value.length === 0) {
      return 0.0;
    } else if (value.length === 1) {
      return value[0].calculo.toFixed(1);
    } else {
      return (value.reduce((a, b) => {
        return a.calculo + b.calculo;
      })).toFixed(1);
    }
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
