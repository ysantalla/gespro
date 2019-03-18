import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Pago, Annos, MesesGQL, AnnosGQL, Meses } from '@app/graphql/types';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const createPago = gql`
  mutation createPago(
    $data: PagoCreateInput!
    $whereInput: PagoWhereInput!
  ) {
    createPago(data: $data, whereInput: $whereInput) {
      id
    }
  }
`;

@Component({
  selector: 'app-pago-create',
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
            [formGroup]='createPagoForm'
            #f='ngForm'
            (ngSubmit)='onCreatePago()'
            class='form'
          >
            <mat-toolbar color="primary">
                <h1 class='mat-h1'>Crear Pago</h1>
            </mat-toolbar>
            <mat-card class='pago-card'>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Años habilitados" formControlName="annos">
                    <mat-option *ngFor="let i of annos | async" [value]="i">{{i.numero}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Meses habilitados" formControlName="meses">
                    <mat-option *ngFor="let i of meses | async" [value]="i">{{i.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput type="number" placeholder="Horas de presencia" formControlName="horas">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador presencia" formControlName="presencia">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador incidencia" formControlName="incidencia">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador relevancia" formControlName="relevancia">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador complejidad" formControlName="complejidad">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador gestión" formControlName="gestion">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador vinculación" formControlName="vinculacion">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador calidad" formControlName="calidad">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador significación" formControlName="significacion">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Indicador cumplimiento" formControlName="cumplimiento">
                    <mat-option *ngFor="let i of indicadores" [value]="i">{{i}}</mat-option>
                  </mat-select>
                </mat-form-field>


              </mat-card-content>

              <mat-card-actions>
                <button
                  mat-raised-button
                  color='primary'
                  type='submit'
                  [disabled]='!createPagoForm.valid'
                  aria-label='createPago'
                >
                  <mat-icon>add</mat-icon>
                  <span>Pago</span>
                </button>

                <a
                  mat-raised-button
                  color='accent'
                  [routerLink]="['/admin','project', projectId, 'integrante', integranteId, 'pagos']"
                  routerLinkActive
                  type='button'
                  aria-label='pagosList'
                >
                  <mat-icon>list</mat-icon>
                  <span>Listado de pagos</span>
                </a>
              </mat-card-actions>
            </mat-card>
          </form>
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
export class PagoCreateComponent implements OnInit {
  createPagoForm: FormGroup;
  loading = false;

  integranteId: string;
  projectId: string;

  validUser = false;

  meses: Observable<Meses.Meses[]>;
  annos: Observable<Annos.Annos[]>;

  indicadores: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo,
    private activedRoute: ActivatedRoute,
    private mesesGQL: MesesGQL,
    private annosGQL: AnnosGQL
  ) {}

  ngOnInit() {
    this.integranteId = this.activedRoute.snapshot.params['integranteId'];
    this.projectId = this.activedRoute.snapshot.params['projectId'];

    this.meses = this.mesesGQL.watch(
      {
        where: {
          habilitado: true
        }
      },
      {
        fetchPolicy: 'network-only'
      }
    )
      .valueChanges
      .pipe(
        map(result => result.data.meses)
      );

    this.annos = this.annosGQL.watch(
      {
        where: {
          habilitado: true
        }
      },
      {
        fetchPolicy: 'network-only'
      }
    )
      .valueChanges
      .pipe(
        map(result => result.data.annos)
      );

    this.createPagoForm = this.formBuilder.group(
      {
        meses: ['', Validators.required],
        annos: ['', Validators.required],
        horas: [1, Validators.required],
        presencia: [1, Validators.required],
        incidencia: [1, Validators.required],
        relevancia: [1, Validators.required],
        complejidad: [1, Validators.required],
        gestion: [1, Validators.required],
        vinculacion: [1, Validators.required],
        calidad: [1, Validators.required],
        significacion: [1, Validators.required],
        cumplimiento: [1, Validators.required],
      }
    );

  }



  onCreatePago(): void {
    this.loading = true;

    if (this.createPagoForm.valid) {
      this.createPagoForm.disable();



      this.apollo
        .mutate({
          mutation: createPago,
          variables: {
            data: {
              integrante: {
                connect: {
                  id: this.integranteId
                }
              },
              mes: {
                connect: {
                  id: this.createPagoForm.value.meses.id
                }
              },
              anno: {
                connect: {
                  id: this.createPagoForm.value.annos.id
                }
              },
              horas: this.createPagoForm.value.horas,
              presencia: this.createPagoForm.value.presencia,
              incidencia: this.createPagoForm.value.incidencia,
              relevancia: this.createPagoForm.value.relevancia,
              complejidad: this.createPagoForm.value.complejidad,
              gestion: this.createPagoForm.value.gestion,
              vinculacion: this.createPagoForm.value.vinculacion,

              calidad: this.createPagoForm.value.calidad,

              significacion: this.createPagoForm.value.significacion,
              cumplimiento: this.createPagoForm.value.cumplimiento,
            },
            whereInput: {
              anno: {id: this.createPagoForm.value.annos.id},
              mes: {id: this.createPagoForm.value.meses.id},
              integrante: {id: this.integranteId},

              horas: this.createPagoForm.value.horas,
              presencia: this.createPagoForm.value.presencia,
              incidencia: this.createPagoForm.value.incidencia,
              relevancia: this.createPagoForm.value.relevancia,
              complejidad: this.createPagoForm.value.complejidad,
              gestion: this.createPagoForm.value.gestion,
              vinculacion: this.createPagoForm.value.vinculacion,

              calidad: this.createPagoForm.value.calidad,

              significacion: this.createPagoForm.value.significacion,
              cumplimiento: this.createPagoForm.value.cumplimiento,
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.createPagoForm.enable();

            if (data) {
              this.snackBar.open(
                `Pago con id ${
                  data.createPago.id
                } creado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate([
                '/admin',
                'project',
                this.projectId,
                'integrante',
                this.integranteId,
                'pagos'
              ]);
            }
          },
          error => {
            this.loading = false;
            this.createPagoForm.enable();
            if (error.graphQLErrors.length > 0) {
              let errorMessage = '';
              error.graphQLErrors.map(graphqlError => {
                errorMessage += graphqlError.message;
              });
              this.snackBar.open(errorMessage, 'X', { duration: 3000 });
            } else if (error.networkError) {
              this.snackBar.open(error.networkError.message, 'X', {
                duration: 3000
              });
            } else {
              this.snackBar.open(error.message, 'X', { duration: 3000 });
            }
          }
        );
    } else {
      console.log('Form not valid');
    }
  }
}
