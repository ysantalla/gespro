import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../services/directory.service';
import { Users, ExistUserGQL } from '@app/graphql/types';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

const createIntegrante = gql`
  mutation createIntegrante(
    $data: IntegranteCreateInput!,
    $whereInput: IntegranteWhereInput!) {
    createIntegrante(data: $data, whereInput: $whereInput) {
      usuario {
        id
        firstname
      }
      proyecto {
        id
      }
      id
    }
  }
`;


@Component({
  selector: 'app-directory',
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
            [formGroup]='addProfesorForm'
            #f='ngForm'
            (ngSubmit)='onCreateProfesor()'
            class='form'
          >
            <mat-toolbar color="primary">
                <h1 class='mat-h1'>Adicionar Profesor</h1>
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

              </mat-card-content>
              <mat-card-actions>
                <button
                  mat-raised-button
                  color='primary'
                  type='submit'
                  [disabled]='!addProfesorForm.valid || !validUser'
                  aria-label='createIntegrante'
                >
                  <mat-icon>add</mat-icon>
                  <span>Profesor</span>
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
  styles: [`
    .full-width {
      width: 100%;
    }
    `]
})
export class DirectoryComponent implements OnInit {

  addProfesorForm: FormGroup;
  loading = false;

  filteredUsers: Observable<Users.Users[]>;
  projectId: string;

  validUser = false;

  usuarioFormControl = new FormControl('', Validators.required);

  existUser: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private activedRoute: ActivatedRoute,
    private directoryService: DirectoryService,
    private apollo: Apollo,
    private existUserGQL:  ExistUserGQL
  ) {}

  ngOnInit() {
    this.projectId = this.activedRoute.snapshot.params['projectId'];

    this.addProfesorForm = this.formBuilder.group(
      {
        usuario: this.usuarioFormControl
      }
    );

    this.usuarioFormControl.valueChanges
      .subscribe(data => {
        this.loading = true;
        if (typeof data === 'string') {
          this.validUser = false;
          this.filteredUsers = this._filter(data);
        } else {
          this.validUser = true;

        }
        this.loading = false;
      });
  }

  displayFn(user?: Users.Users): string | undefined {
    return user
      ? `${user.firstname} ${user.lastname} --- ${user.username} --- ${
          user.employeeNumber
        }`
      : undefined;
  }

  _filter(name: string): Observable<any> {
    return this.directoryService.getProfesorList(name).pipe(
      map((data) => {
        const users: Users.Users[] = [];

        for (const key in data.data) {
          if ((data.data.hasOwnProperty(key)) && (typeof(data.data[key]) === 'object')) {

            if (
              data.data[key].mail &&
              data.data[key].employeenumber &&
              data.data[key].displayname &&
              data.data[key].givenname &&
              data.data[key].sn &&
              data.data[key].samaccountname
            ) {
              users.push({
                id: null,
                roles: [],
                email: data.data[key].mail[0],
                employeeNumber: data.data[key].employeenumber[0],
                fullname: data.data[key].displayname[0],
                firstname: data.data[key].givenname[0],
                lastname: data.data[key].sn[0],
                username: data.data[key].samaccountname[0],
              });
            }
          }
        }

        return users;
      }),
      catchError((err: any) => {
        console.log(err);
        this.snackBar.open('Opss, ha ocurrido un error', 'X', {duration: 3000});
        return of([]);
      })
    );
  }

  onCreateProfesor() {
    this.loading = true;

    if (this.addProfesorForm.valid) {
      this.addProfesorForm.disable();

      this.apollo
        .mutate({
          mutation: createIntegrante,
          variables: {
            data: {
              usuario: {
                create: {
                  email: this.addProfesorForm.value.usuario.email,
                  firstname: this.addProfesorForm.value.usuario.firstname,
                  lastname: this.addProfesorForm.value.usuario.lastname,
                  username: this.addProfesorForm.value.usuario.username,
                  fullname: this.addProfesorForm.value.usuario.fullname,
                  employeeNumber: this.addProfesorForm.value.usuario.employeeNumber.toString(),
                  roles: {
                    connect: {
                      name: 'PROFESOR'
                    }
                  }
                }
              },
              proyecto: {
                connect: {
                  id: this.projectId
                }
              }
            },
            whereInput: {
              usuario: {
                username: this.addProfesorForm.value.usuario.username
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
            this.addProfesorForm.enable();

            if (data) {
              this.snackBar.open(
                `Usuario ${data.createIntegrante.usuario.firstname} adicionado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['jproject', 'project', this.projectId, 'integrantes']);
            }
          },
          (error) => {
            this.loading = false;
            this.addProfesorForm.enable();
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
