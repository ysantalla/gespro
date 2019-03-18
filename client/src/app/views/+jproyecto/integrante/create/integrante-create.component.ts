import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Users, UsersGQL } from '@app/graphql/types';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const createIntegrante = gql`
  mutation createIntegrante(
    $data: IntegranteCreateInput!
    $whereInput: IntegranteWhereInput!
  ) {
    createIntegrante(data: $data, whereInput: $whereInput) {
      id
      usuario {
        firstname
      }
      proyecto {
        codigo
      }
    }
  }
`;

@Component({
  selector: 'app-integrante-create',
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
            [formGroup]='createIntegranteForm'
            #f='ngForm'
            (ngSubmit)='onCreateIntegrante()'
            class='form'
          >
            <mat-toolbar color="primary">
                <h1 class='mat-h1'>Crear Integrante</h1>
            </mat-toolbar>
            <mat-card class='integrante-card'>

              <mat-card-content>

                <mat-form-field class='full-width'>
                  <input
                    type='text'
                    placeholder='Escriba el nombre del profesor'
                    aria-label='users'
                    matInput
                    formControlName='usuario'
                    [matAutocomplete]='auto'
                  />
                  <mat-autocomplete
                    #auto='matAutocomplete'
                    [displayWith]='displayFn'
                  >
                    <mat-option
                      *ngFor='let option of (filteredUsers | async)'
                      [value]='option'
                    >
                      {{ option.firstname }} {{ option.lastname }} ---
                      {{ option.username }} --- {{ option.employeeNumber }}
                    </mat-option>
                  </mat-autocomplete>
                </mat-form-field>

                <mat-checkbox formControlName='jproyecto'>Jefe de Proyecto</mat-checkbox>

              </mat-card-content>
              <mat-card-actions>
                <button
                  mat-raised-button
                  color='primary'
                  type='submit'
                  [disabled]='!createIntegranteForm.valid || !validUser'
                  aria-label='createIntegrante'
                >
                  <mat-icon>add</mat-icon>
                  <span>Integrante</span>
                </button>

                <a
                  mat-raised-button
                  color='accent'
                  [routerLink]="['/jproject','project', projectId, 'integrantes']"
                  routerLinkActive
                  type='button'
                  aria-label='integrantesList'
                >
                  <mat-icon>list</mat-icon>
                  <span>Listado de integrantes</span>
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
export class IntegranteCreateComponent implements OnInit {
  createIntegranteForm: FormGroup;
  loading = false;

  filteredUsers: Observable<Users.Users[]>;
  projectId: string;

  validUser = false;

  usuarioFormControl = new FormControl('', Validators.required);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo,
    private usersGQL: UsersGQL,
    private activedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.activedRoute.snapshot.params['projectId'];

    this.createIntegranteForm = this.formBuilder.group(
      {
        usuario: this.usuarioFormControl,
        jproyecto: ['']
      }
    );

    this.usuarioFormControl.valueChanges
      .subscribe(data => {
        if (typeof data === 'string') {
          this.validUser = false;
          this.filteredUsers = this._filter(data);
        } else {
          this.validUser = true;
        }
      });
  }

  displayFn(user?: Users.Users): string | undefined {
    return user
      ? `${user.firstname} ${user.lastname} --- ${user.username} --- ${
          user.employeeNumber
        }`
      : undefined;
  }

  _filter(name: string): Observable<Users.Users[]> {

    return this.usersGQL
      .watch(
        {
          where: {
            fullname_starts_with: name,
          },
          first: 20
        },
        {
          fetchPolicy: 'network-only'
        }
      )
      .valueChanges.pipe(map(result => {
        return result.data.users;
      }));
  }

  onCreateIntegrante(): void {
    this.loading = true;

    if (this.createIntegranteForm.valid) {
      this.createIntegranteForm.disable();

      this.apollo
        .mutate({
          mutation: createIntegrante,
          variables: {
            data: {
              usuario: {
                connect: {
                  id: this.createIntegranteForm.value.usuario.id
                }
              },
              proyecto: {
                connect: {
                  id: this.projectId
                }
              },
              jefeProyecto: this.createIntegranteForm.value.jproyecto || false
            },
            whereInput: {
              usuario: {
                id: this.createIntegranteForm.value.usuario.id
              },
              proyecto: {
                id: this.projectId
              }
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.createIntegranteForm.enable();

            if (data) {
              this.snackBar.open(
                `Integrante ${
                  data.createIntegrante.usuario.firstname
                } creado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate([
                '/jproject',
                'project',
                this.projectId,
                'integrantes'
              ]);
            }
          },
          error => {
            this.loading = false;
            this.createIntegranteForm.enable();
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
