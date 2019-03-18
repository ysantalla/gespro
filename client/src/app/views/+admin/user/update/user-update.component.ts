import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { User, Role } from '@app/core/model/user.model';

const updateUser = gql`
  mutation updateUser($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      id
      firstname
      email
      lastname
    }
  }
`;

const userQuery = gql`
  query user($id: String!) {
    user(id: $id) {
      id
      firstname
      email
      lastname
      username
      employeeNumber
      roles {
        id
        name
        description
      }
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
  selector: 'app-user-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateUserForm" #f="ngForm" (ngSubmit)="onUpdateUser()" class="form">
            <mat-card class="user-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar Usuario</h1>
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
                    <ng-container *ngIf="userData">
                      <mat-option *ngFor="let role of roles" [value]="role.id">{{role.name}}</mat-option>
                    </ng-container>
                  </mat-select>
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateUserForm.valid" aria-label="updateUser">
                  <mat-icon>mode_edit</mat-icon>
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
export class UserUpdateComponent implements OnInit, OnDestroy {
  updateUserForm: FormGroup;
  userData: User;
  roles: any;
  userId: string;
  loading = false;
  userQuerySubscription: Subscription;
  rolesQuerySubcription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.updateUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      employeeNumber: ['', Validators.required],
      roles: ['', Validators.required],
    });

    this.userId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateUserForm.disable();

    this.rolesQuerySubcription = this.apollo
      .watchQuery<any>({
        query: rolesQuery
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.roles = data.roles;
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

    this.userQuerySubscription = this.apollo
      .watchQuery<any>({
        query: userQuery,
        variables: {
          id: this.userId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.userData = data.user;
          this.updateUserForm.enable();
          this.loading = false;

          this.updateUserForm.patchValue({
            email: this.userData.email,
            firstname: this.userData.firstname,
            lastname: this.userData.lastname,
            username: this.userData.username,
            employeeNumber: this.userData.employeeNumber,
            roles: this.userData.roles.map(roles => roles.id)
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

  onUpdateUser() {
    this.loading = true;

    if (this.updateUserForm.valid) {
      this.updateUserForm.disable();

      const initial = this.userData.roles.map(roles => roles.id);
      const final = this.updateUserForm.value.roles;

      const dataForm: any = {
        'email': this.updateUserForm.value.email,
        'firstname': this.updateUserForm.value.firstname,
        'lastname': this.updateUserForm.value.lastname,
        'fullname': `${this.updateUserForm.value.firstname} ${this.updateUserForm.value.lastname}`,
        'username': this.updateUserForm.value.username,
        'employeeNumber': this.updateUserForm.value.employeeNumber,
        'roles': {
          'connect': final.filter(word => !initial.includes(word)).map(id => {
            return {id: id};
          }),
          'disconnect': initial.filter(word => !final.includes(word)).map(id => {
            return {id: id};
          })
        }
      };

      this.updateUserForm.enable();

      this.apollo
        .mutate({
          mutation: updateUser,
          variables: {
            data: dataForm,
            where : {
              id: this.userId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateUserForm.enable();

            if (data) {
              this.snackBar.open(
                `Usuario ${
                  data.updateUser.firstname
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'user']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateUserForm.enable();
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
    this.userQuerySubscription.unsubscribe();
    this.rolesQuerySubcription.unsubscribe();
  }
}
