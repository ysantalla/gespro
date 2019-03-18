import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Users, UsersGQL, Integrante } from '@app/graphql/types';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


const updateIntegrante = gql`
  mutation updateIntegrante(
    $data: IntegranteUpdateInput!
    $where: IntegranteWhereUniqueInput!
    $whereInput: IntegranteWhereInput!
  ) {
    updateIntegrante(data: $data, where: $where, whereInput: $whereInput) {
      id
      usuario {
        id
        firstname
      }
      proyecto {
        id
        codigo
      }
    }
  }
`;

const integranteQuery = gql`
  query integrante($id: String!) {
    integrante(id: $id) {
      id
      usuario {
        id
        firstname
        lastname
        employeeNumber
        fullname
        username
      }
      proyecto {
        id
        codigo
        nombre
      }
      jefeProyecto
    }
  }
`;


@Component({
  selector: 'app-integrante-update',
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
            [formGroup]='updateIntegranteForm'
            #f='ngForm'
            (ngSubmit)='onUpdateIntegrante()'
            class='form'
          >
            <mat-toolbar color="primary">
                <h1 class='mat-h1'>Modificar Integrante</h1>
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
                  [disabled]='!updateIntegranteForm.valid || !validUser'
                  aria-label='updateIntegrante'
                >
                  <mat-icon>mode_edit</mat-icon>
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
export class IntegranteUpdateComponent implements OnInit, OnDestroy {
  updateIntegranteForm: FormGroup;
  loading = false;

  integranteData: Integrante.Integrante;
  integranteId: string;
  integranteQuerySubscription: Subscription;

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

    this.integranteId = this.activedRoute.snapshot.params['integranteId'];

    this.updateIntegranteForm = this.formBuilder.group(
      {
        usuario: this.usuarioFormControl,
        jproyecto: ['']
      }
    );

    this.usuarioFormControl.valueChanges
      .subscribe(data => {
        if (typeof data === 'string') {
          this.filteredUsers = this._filter(data);
        } else {
          this.validUser = true;
        }
      });

    this.integranteQuerySubscription = this.apollo
      .watchQuery<any>({
        query: integranteQuery,
        variables: {
          id: this.integranteId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.integranteData = data.integrante;
          this.updateIntegranteForm.enable();
          this.loading = false;

          this.updateIntegranteForm.patchValue({
            usuario: this.integranteData.usuario,
            jproyecto: this.integranteData.jefeProyecto || false
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

  onUpdateIntegrante(): void {
    this.loading = true;

    if (this.updateIntegranteForm.valid) {
      this.updateIntegranteForm.disable();

      this.apollo
        .mutate({
          mutation: updateIntegrante,
          variables: {
            data: {
              usuario: {
                connect: {
                  id: this.updateIntegranteForm.value.usuario.id
                }
              },
              proyecto: {
                connect: {
                  id: this.projectId
                }
              },
              jefeProyecto: this.updateIntegranteForm.value.jproyecto || false
            },
            where: {
              id: this.integranteId
            },
            whereInput: {
              usuario: {
                id: this.updateIntegranteForm.value.usuario.id
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
            this.updateIntegranteForm.enable();

            if (data) {
              this.snackBar.open(
                `Integrante ${
                  data.updateIntegrante.usuario.firstname
                } actualizado correctamente`,
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
            this.updateIntegranteForm.enable();
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
    this.integranteQuerySubscription.unsubscribe();
  }
}
