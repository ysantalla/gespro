import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Pago, Meses, Annos, AnnosGQL, MesesGQL, Pagos } from '@app/graphql/types';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';


const updatePago = gql`
  mutation updatePago(
    $data: PagoUpdateInput!
    $where: PagoWhereUniqueInput!
    $whereInput: PagoWhereInput!
  ) {
    updatePago(data: $data, where: $where, whereInput: $whereInput) {
      id
    }
  }
`;

const pagoQuery = gql`
  query pago($id: String!) {
    pago(id: $id) {
      id
      integrante {
        id
        usuario {
          id
          fullname
        }
      }
      mes {
        id
        nombre
      }
      anno {
        id
        numero
      }
      horas
      presencia
      incidencia
      relevancia
      complejidad
      gestion
      vinculacion
      calidad
      significacion
      cumplimiento
    }
  }
`;


@Component({
  selector: 'app-pago-update',
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
            [formGroup]='updatePagoForm'
            #f='ngForm'
            (ngSubmit)='onUpdatePago()'
            class='form'
          >
            <mat-toolbar color="primary">
                <h1 class='mat-h1'>Modificar Pago</h1>
            </mat-toolbar>
            <mat-card class='pago-card'>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Años habilitados" formControlName="annos">
                    <mat-option *ngFor="let i of annos | async" [value]="i.id">{{i.numero}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Meses habilitados" formControlName="meses">
                    <mat-option *ngFor="let i of meses | async" [value]="i.id">{{i.nombre}}</mat-option>
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
                  [disabled]='!updatePagoForm.valid'
                  aria-label='updatePago'
                >
                  <mat-icon>mode_edit</mat-icon>
                  <span>Pago</span>
                </button>

                <a
                  mat-raised-button
                  color='accent'
                  [routerLink]="['/jproject','project', projectId, 'integrante', integranteId, 'pagos']"
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
export class PagoUpdateComponent implements OnInit, OnDestroy {
  updatePagoForm: FormGroup;
  loading = false;

  pagoData: Pagos.Pagos;
  pagoId: string;
  pagoQuerySubscription: Subscription;

  meses: Observable<Meses.Meses[]>;
  annos: Observable<Annos.Annos[]>;

  projectId: string;
  integranteId: string;

  indicadores: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo,
    private mesesGQL: MesesGQL,
    private annosGQL: AnnosGQL,
    private activedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.integranteId = this.activedRoute.snapshot.params['integranteId'];
    this.projectId = this.activedRoute.snapshot.params['projectId'];

    this.pagoId = this.activedRoute.snapshot.params['pagoId'];

    this.updatePagoForm = this.formBuilder.group(
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

    this.updatePagoForm.disable();

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

    this.pagoQuerySubscription = this.apollo
      .watchQuery<any>({
        query: pagoQuery,
        variables: {
          id: this.pagoId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.pagoData = data.pago;
          this.updatePagoForm.enable();
          this.loading = false;

          this.updatePagoForm.patchValue({
            meses: this.pagoData.mes.id,
            annos: this.pagoData.anno.id,
            horas: this.pagoData.horas,
            presencia: this.pagoData.presencia,
            incidencia: this.pagoData.incidencia,
            relevancia: this.pagoData.relevancia,
            complejidad: this.pagoData.complejidad,
            gestion: this.pagoData.gestion,
            vinculacion: this.pagoData.vinculacion,

            calidad: this.pagoData.calidad,

            significacion: this.pagoData.significacion,
            cumplimiento: this.pagoData.cumplimiento,
          });
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

  onUpdatePago(): void {
    this.loading = true;

    if (this.updatePagoForm.valid) {
      this.updatePagoForm.disable();

      this.apollo
        .mutate({
          mutation: updatePago,
          variables: {
            data: {
              integrante: {
                connect: {
                  id: this.integranteId
                }
              },
              mes: {
                connect: {
                  id: this.updatePagoForm.value.meses
                }
              },
              anno: {
                connect: {
                  id: this.updatePagoForm.value.annos
                }
              },
              horas: this.updatePagoForm.value.horas,
              presencia: this.updatePagoForm.value.presencia,
              incidencia: this.updatePagoForm.value.incidencia,
              relevancia: this.updatePagoForm.value.relevancia,
              complejidad: this.updatePagoForm.value.complejidad,
              gestion: this.updatePagoForm.value.gestion,
              vinculacion: this.updatePagoForm.value.vinculacion,

              calidad: this.updatePagoForm.value.calidad,

              significacion: this.updatePagoForm.value.significacion,
              cumplimiento: this.updatePagoForm.value.cumplimiento,
            },
            where: {
              id: this.pagoId
            },
            whereInput: {
              anno: {id: this.updatePagoForm.value.annos},
              mes: {id: this.updatePagoForm.value.meses},
              integrante: {id: this.integranteId},

              horas: this.updatePagoForm.value.horas,
              presencia: this.updatePagoForm.value.presencia,
              incidencia: this.updatePagoForm.value.incidencia,
              relevancia: this.updatePagoForm.value.relevancia,
              complejidad: this.updatePagoForm.value.complejidad,
              gestion: this.updatePagoForm.value.gestion,
              vinculacion: this.updatePagoForm.value.vinculacion,

              calidad: this.updatePagoForm.value.calidad,

              significacion: this.updatePagoForm.value.significacion,
              cumplimiento: this.updatePagoForm.value.cumplimiento,

            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updatePagoForm.enable();

            if (data) {
              this.snackBar.open(
                `Pago con id ${
                  data.updatePago.id
                } actualizado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate([
                '/jproject',
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
            this.updatePagoForm.enable();
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

  ngOnDestroy(): void {
    this.pagoQuerySubscription.unsubscribe();
  }
}
