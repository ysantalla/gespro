import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { User } from '@app/core/model/user.model';

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
        name
        description
      }
    }
  }
`;

@Component({
  selector: 'app-user-details',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="98%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <mat-card class="user-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Detalles Usuario</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <mat-grid-list *ngIf="userData" cols="2" rowHeight="9:1">
                <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userData.id}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Nombre:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userData.firstname}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Apellidos:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userData.lastname}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Correo:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userData.email}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Usuario:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userData.username}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Número de Trabajador:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userData.employeeNumber}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Roles:</h3></mat-grid-tile>
                <mat-grid-tile>
                  <mat-chip-list *ngFor="let role of userData.roles">
                    <mat-chip class="role" color="accent">{{role.name}}</mat-chip>
                  </mat-chip-list>
                </mat-grid-tile>
              </mat-grid-list>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/user" routerLinkActive type="button" aria-label="details">
                <mat-icon>list</mat-icon>
                <span>Listado de usuarios</span>
              </button>
              <button *ngIf="userData" mat-raised-button color="primary" [routerLink]="['/admin','user', 'update', userData.id]"
                    routerLinkActive="active">
                <mat-icon>mode_edit</mat-icon>
                <span>Editar</span>
              </button>
            </mat-card-actions>
          </mat-card>

        </div>
      </div>
    </div>

  `,
  styles: [
    `mat-chip.role {
        margin: 10px;
      }
    `
  ]
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  userData: User;
  userId: string;
  loading = false;
  userQuerySubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;

    this.userQuerySubscription = this.apollo
      .watchQuery<any>({
        query: userQuery,
        variables: {
          id: this.userId
        }
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          if (!loading) {
            this.userData = data.user;
            this.loading = false;
          }
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
  }

  ngOnDestroy(): void {
    this.userQuerySubscription.unsubscribe();
  }
}
