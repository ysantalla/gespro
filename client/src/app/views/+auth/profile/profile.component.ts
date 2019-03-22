import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription, Observable } from 'rxjs';

//import { User } from '@app/core/model/user.model';

import { Me, MeGQL } from '@app/graphql/types';

const meQuery = gql`
  query me {
    me {
      id
      firstname
      lastname
      email
      username
      employeeNumber
      roles {
        id
        name
      }
    }
  }
`;

@Component({
  selector: 'app-profile',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="98%" fxFlex.xs="98%" fxFlex.md="96%">

        <div class="mat-elevation-z8">
          <mat-card class="user-details-card">
            <mat-card-header>
              <mat-card-title>
                <h1 class="mat-h1">Perfil de Usuario</h1>
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>

              <mat-grid-list *ngIf="userMe" cols="2" rowHeight="10:1">
                <mat-grid-tile><h3 class="mat-h3">Id:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userMe.id}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Nombre:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userMe.firstname}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Apellidos:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userMe.lastname}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Correo:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userMe.email}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Usuario:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userMe.username}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Número de Trabajador:</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3"> {{userMe.employeeNumber}}</h3></mat-grid-tile>
                <mat-grid-tile><h3 class="mat-h3">Roles:</h3></mat-grid-tile>
                <mat-grid-tile>
                  <mat-chip-list *ngFor="let role of userMe.roles">
                    <mat-chip class="role" color="accent">{{role.name}}</mat-chip>
                  </mat-chip-list>
                </mat-grid-tile>
              </mat-grid-list>

            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" type="button"
                routerLink="/dashboard" routerLinkActive="active"
                aria-label="dashboard">
              <mat-icon>dashboard</mat-icon>
              <span>Escritorio</span>
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
export class ProfileComponent implements OnInit, OnDestroy {

  loading = false;
  hide = true;
  userMe: Me.Me;

  meQuerySubcription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private meGQL: MeGQL
  ) { }

  ngOnInit() {

    this.loading = true;

    this.meQuerySubcription = this.meGQL.watch({
        fetchPolicy: 'cache'
      })
      .valueChanges
      .subscribe(({data, loading}) => {
      if (data) {
        this.userMe = data.me;
      }
      this.loading = loading;
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

  ngOnDestroy(): void {
    this.meQuerySubcription.unsubscribe();
  }

}
