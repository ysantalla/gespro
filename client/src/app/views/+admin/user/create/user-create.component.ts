import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

const createUser = gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      firstname
    }
  }
`;

const rolesQuery = gql`
  query roles {
    roles {
      id
      name
      description
    }
  }
`;

@Component({
  selector: 'app-user-create',
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
            <mat-card class="user-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Crear Usuario</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="email" placeholder="Correo" formControlName="email">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Usuario UPR" formControlName="username">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre" formControlName="firstname">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Apellidos" formControlName="lastname">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Número de Empleado" formControlName="employeeNumber">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-select placeholder="Roles" formControlName="roles" multiple>
                    <mat-option *ngFor="let role of roles" [value]="{id: role.id}">{{role.name}}</mat-option>
                  </mat-select>
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!createUserForm.valid" aria-label="createUser">
                  <mat-icon>add</mat-icon>
                  <span>Usuario</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/user" routerLinkActive type="button" aria-label="usersList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de usuarios</span>
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
export class UserCreateComponent implements OnInit, OnDestroy {

  createUserForm: FormGroup;
  loading = false;
  rolesQuerySubcription: Subscription;
  roles: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {

    this.createUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      employeeNumber: ['', Validators.required],
      roles: ['', Validators.required]
    });

    this.createUserForm.disable();
    this.loading = true;

    this.rolesQuerySubcription = this.apollo
      .watchQuery<any>({
        query: rolesQuery
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.loading = false;
            this.roles = data.roles;
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
    this.rolesQuerySubcription.unsubscribe();
  }

  onCreateUser(): void {
    this.loading = true;

    if (this.createUserForm.valid) {

      this.createUserForm.disable();
      this.apollo
        .mutate({
          mutation: createUser,
          variables: {
            data: {
              email: this.createUserForm.value.email,
              firstname: this.createUserForm.value.firstname,
              lastname: this.createUserForm.value.lastname,
              username: this.createUserForm.value.username,
              fullname: `${this.createUserForm.value.firstname} ${this.createUserForm.value.lastname}`,
              employeeNumber: this.createUserForm.value.employeeNumber.toString(),
              roles: {
                connect: this.createUserForm.value.roles
              }
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.createUserForm.enable();

            if (data) {
              this.snackBar.open(
                `Usuario ${data.createUser.firstname} creado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'user']);
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
