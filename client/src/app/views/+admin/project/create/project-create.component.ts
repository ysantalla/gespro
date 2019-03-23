import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

const createProject = gql`
  mutation createProyecto($data: ProyectoCreateInput!) {
    createProyecto(data: $data) {
      nombre
    }
  }
`;

const areasQuery = gql`
  query areas {
    areas {
      id
      nombre
    }
  }
`;

const ejesQuery = gql`
  query ejes {
    ejes {
      id
      nombre
    }
  }
`;

const lineasQuery = gql`
  query lineas {
    lineas {
      id
      nombre
    }
  }
`;

const alcancesQuery = gql`
  query alcances {
    alcances {
      id
      nombre
    }
  }
`;

const typesQuery = gql`
  query tipos {
    tipos {
      id
      nombre
    }
  }
`;

@Component({
  selector: 'app-project-create',
  template: `
    <div class="container">
      <div class="loading">
        <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
      </div>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="createUserForm" #f="ngForm" (ngSubmit)="onCreateUser()" class="form">
            <mat-toolbar color="primary" width="100%">
              <h1 class="mat-h1">Crear Proyecto</h1>
            </mat-toolbar>
            <mat-card class="user-card">

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Código del proyecto" formControlName="codigo">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <textarea matInput required placeholder="Nombre del proyecto" formControlName="nombre"></textarea>
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
                    <mat-option *ngFor="let type of types" [value]="{id: type.id}">{{type.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Area" formControlName="area">
                    <mat-option *ngFor="let area of areas" [value]="{id: area.id}">{{area.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Ejes estratégicos" formControlName="eje">
                    <mat-option *ngFor="let eje of ejes" [value]="{id: eje.id}">{{eje.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Líneas de Investigación " formControlName="linea">
                    <mat-option *ngFor="let linea of lineas" [value]="{id: linea.id}">{{linea.nombre}}</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Alcance" formControlName="alcance">
                    <mat-option *ngFor="let alcance of alcances" [value]="{id: alcance.id}">{{alcance.nombre}}</mat-option>
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
                <button mat-raised-button color="primary" type="submit" [disabled]="!createUserForm.valid" aria-label="createUser">
                  <mat-icon>add</mat-icon>
                  <span>Proyecto</span>
                </button>

                <button mat-raised-button color="accent"
                      routerLink="/admin/project" routerLinkActive type="button" aria-label="projectsList">
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
export class ProjectCreateComponent implements OnInit, OnDestroy {

  createUserForm: FormGroup;
  loading = false;
  areasQuerySubcription: Subscription;
  ejesQuerySubcription: Subscription;
  lineasQuerySubcription: Subscription;
  typesQuerySubcription: Subscription;
  alcancesQuerySubcription: Subscription;
  areas: any;
  ejes: any;
  lineas: any;
  types: any;
  alcances: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {

    this.createUserForm = this.formBuilder.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      inicia: ['', Validators.required],
      finaliza: ['', Validators.required],
      tipo: ['', Validators.required],
      area: ['', Validators.required],
      eje: ['', Validators.required],
      linea: ['', Validators.required],
      alcance: ['', Validators.required],
      estado: ['', Validators.required],
    });

    this.createUserForm.disable();
    this.loading = true;

    this.areasQuerySubcription = this.apollo
      .watchQuery<any>({
        query: areasQuery
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.loading = false;
            this.areas = data.areas;
            this.createUserForm.enable();
          }
        },
        (error) => {
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

      this.lineasQuerySubcription = this.apollo
      .watchQuery<any>({
        query: lineasQuery
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.loading = false;
            this.lineas = data.lineas;
            this.createUserForm.enable();
          }
        },
        (error) => {
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

      this.ejesQuerySubcription = this.apollo
      .watchQuery<any>({
        query: ejesQuery
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.loading = false;
            this.ejes = data.ejes;
            this.createUserForm.enable();
          }
        },
        (error) => {
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

      this.alcancesQuerySubcription = this.apollo
        .watchQuery<any>({
          query: alcancesQuery
        })
        .valueChanges.subscribe(
          ({ data, loading }) => {
            if (!loading) {
              this.loading = false;
              this.alcances = data.alcances;
              this.createUserForm.enable();
            }
          },
          (error) => {
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

      this.typesQuerySubcription = this.apollo
      .watchQuery<any>({
        query: typesQuery
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.loading = false;
            this.types = data.tipos;
            this.createUserForm.enable();
          }
        },
        (error) => {
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

  ngOnDestroy() {
    this.typesQuerySubcription.unsubscribe();
    this.areasQuerySubcription.unsubscribe();
    this.alcancesQuerySubcription.unsubscribe();
    this.areasQuerySubcription.unsubscribe();
    this.lineasQuerySubcription.unsubscribe();
  }

  onCreateUser(): void {
    this.loading = true;

    if (this.createUserForm.valid) {

      this.createUserForm.disable();
      this.apollo
        .mutate({
          mutation: createProject,
          variables: {
            data: {
              nombre: this.createUserForm.value.nombre,
              codigo: this.createUserForm.value.codigo,
              inicia: this.createUserForm.value.inicia,
              finaliza: this.createUserForm.value.finaliza,
              area: {
                connect: this.createUserForm.value.area
              },
              eje: {
                connect: this.createUserForm.value.eje
              },
              linea: {
                connect: this.createUserForm.value.linea
              },
              tipo: {
                connect: this.createUserForm.value.tipo
              },
              alcance: {
                connect: this.createUserForm.value.alcance
              },
              estado: this.createUserForm.value.estado,
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.createUserForm.enable();

            if (data) {
              this.snackBar.open(
                `Proyecto ${data.createProyecto.nombre} creado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'project']);
            }
          },
          (error) => {
            this.loading = false;
            this.createUserForm.enable();
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
}
