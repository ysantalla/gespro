import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription, Observable } from 'rxjs';
import { TiposGQL, AreasGQL, ProyectoCreateInput, AlcancesGQL, Proyecto, Tipo, Area, Alcance, Lineas, Ejes, LineasGQL, EjesGQL } from '@app/graphql/types';
import { map } from 'rxjs/operators';
import { EjeCreateComponent } from '../../eje/create/eje-create.component';

const updateProyecto = gql`
  mutation updateProyecto($data: ProyectoUpdateInput!, $where: ProyectoWhereUniqueInput!) {
    updateProyecto(data: $data, where: $where) {
      id
      nombre
    }
  }
`;

const proyectoQuery = gql`
  query proyecto($id: String!) {
    proyecto(id: $id) {
      id
      nombre
      codigo
      inicia
      finaliza
      area {
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
      alcance {
        id
        nombre
        valor
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
  selector: 'app-project-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateProyectoForm" #f="ngForm" (ngSubmit)="onUpdateProyecto()" class="form">
            <mat-card class="proyecto-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar Proyecto</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Código de proyecto" formControlName="codigo">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre de proyecto" formControlName="nombre">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput [matDatepicker]="pickerInit" formControlName="inicia" placeholder="Fecha de inicio del proyeto">
                  <mat-datepicker-toggle matSuffix [for]="pickerInit"></mat-datepicker-toggle>
                  <mat-datepicker #pickerInit disabled="false"></mat-datepicker>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput [matDatepicker]="pickerOver" formControlName="finaliza" placeholder="Fecha de fin del proyeto">
                  <mat-datepicker-toggle matSuffix [for]="pickerOver"></mat-datepicker-toggle>
                  <mat-datepicker #pickerOver disabled="false"></mat-datepicker>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Tipo" formControlName="tipo">
                    <mat-option *ngFor="let type of types | async" [value]="type.id">{{type.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Area" formControlName="area">
                    <mat-option *ngFor="let area of areas | async" [value]="area.id">{{area.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Línea de Investigación" formControlName="linea">
                    <mat-option *ngFor="let linea of lineas | async" [value]="linea.id">{{linea.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Ejes estratégicos" formControlName="eje">
                    <mat-option *ngFor="let eje of ejes | async" [value]="eje.id">{{eje.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Alcance" formControlName="alcance">
                    <mat-option *ngFor="let alcance of alcances | async" [value]="alcance.id">
                      <{{alcance.nombre}} --- {{alcance.valor}}>
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Estado del Proyecto" formControlName="estado">
                    <mat-option value="CREADO">CREADO</mat-option>
                    <mat-option value="HABILITADO">HABILITADO</mat-option>
                    <mat-option value="CERRADO">CERRADO</mat-option>
                  </mat-select>
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateProyectoForm.valid" aria-label="updateProyecto">
                  <mat-icon>mode_edit</mat-icon>
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

  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
    `
  ]
})
export class ProjectUpdateComponent implements OnInit, OnDestroy {
  updateProyectoForm: FormGroup;
  proyectoData: Proyecto.Proyecto;

  proyectoId: string;
  loading = false;

  proyectoQuerySubscription: Subscription;

  types: Observable<Tipo.Tipo[]>;
  areas: Observable<Area.Area[]>;

  ejes: Observable<Ejes.Ejes[]>;
  lineas: Observable<Lineas.Lineas[]>;

  alcances: Observable<Alcance.Alcance[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo,
    private tiposGQL: TiposGQL,
    private areasGQL: AreasGQL,
    private lineasGQL: LineasGQL,
    private ejesGQL: EjesGQL,
    private alcancesGQL: AlcancesGQL
  ) {}

  ngOnInit() {
    this.updateProyectoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      inicia: ['', Validators.required],
      finaliza: ['', Validators.required],
      estado: ['', Validators.required],
      tipo: ['', Validators.required],
      area: ['', Validators.required],
      eje: ['', Validators.required],
      linea: ['', Validators.required],
      alcance: ['', Validators.required],
    });

    this.proyectoId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateProyectoForm.disable();

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


    this.proyectoQuerySubscription = this.apollo
      .watchQuery<any>({
        query: proyectoQuery,
        variables: {
          id: this.proyectoId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.proyectoData = data.proyecto;
          this.updateProyectoForm.enable();
          this.loading = false;

          this.updateProyectoForm.patchValue({
            nombre: this.proyectoData.nombre,
            codigo: this.proyectoData.codigo,
            inicia: this.proyectoData.inicia,
            finaliza: this.proyectoData.finaliza,
            estado: this.proyectoData.estado,
            tipo: this.proyectoData.tipo.id,
            area: this.proyectoData.area.id,
            linea: this.proyectoData.linea.id,
            eje: this.proyectoData.eje.id,
            alcance: this.proyectoData.alcance.id
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

  onUpdateProyecto() {
    this.loading = true;

    if (this.updateProyectoForm.valid) {
      this.updateProyectoForm.disable();

      const initial = this.proyectoData.tipo.id;
      const final = this.updateProyectoForm.value.roles;

      const proyectoCreateInput: ProyectoCreateInput = {
        'nombre': this.updateProyectoForm.value.nombre,
        'codigo': this.updateProyectoForm.value.codigo,
        'inicia': this.updateProyectoForm.value.inicia,
        'finaliza': this.updateProyectoForm.value.finaliza,
        'area': {connect: {id: this.updateProyectoForm.value.area}},
        'eje': {connect: {id: this.updateProyectoForm.value.eje}},
        'linea': {connect: {id: this.updateProyectoForm.value.linea}},
        'tipo': {connect: {id: this.updateProyectoForm.value.tipo}},
        'estado': this.updateProyectoForm.value.estado,
        'alcance': {connect: {id: this.updateProyectoForm.value.alcance}},
      };

      this.updateProyectoForm.enable();

      this.apollo
        .mutate({
          mutation: updateProyecto,
          variables: {
            data: proyectoCreateInput,
            where : {
              id: this.proyectoId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateProyectoForm.enable();

            if (data) {
              this.snackBar.open(
                `Proyecto ${
                  data.updateProyecto.nombre
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'project']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateProyectoForm.enable();
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
    this.proyectoQuerySubscription.unsubscribe();
  }
}
