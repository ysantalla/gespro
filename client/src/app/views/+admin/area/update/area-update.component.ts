import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Area} from '@app/graphql/types';

const updateArea = gql`
  mutation updateArea($data: AreaUpdateInput!, $where: AreaWhereUniqueInput!) {
    updateArea(data: $data, where: $where) {
      id
      nombre
    }
  }
`;

const areaQuery = gql`
  query area($id: String!) {
    area(id: $id) {
      id
      nombre
    }
  }
`;


@Component({
  selector: 'app-area-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateAreaForm" #f="ngForm" (ngSubmit)="onUpdateArea()" class="form">
            <mat-card class="area-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar Area</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre" formControlName="nombre">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateAreaForm.valid" aria-label="updateArea">
                  <mat-icon>mode_edit</mat-icon>
                  <span>Area</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/area" routerLinkActive type="button" aria-label="areasList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de areas</span>
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
export class AreaUpdateComponent implements OnInit, OnDestroy {
  updateAreaForm: FormGroup;
  areaData: Area.Area;
  areaId: string;
  loading = false;
  areaQuerySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.updateAreaForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });

    this.areaId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateAreaForm.disable();

    this.areaQuerySubscription = this.apollo
      .watchQuery<any>({
        query: areaQuery,
        variables: {
          id: this.areaId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.areaData = data.area;
          this.updateAreaForm.enable();
          this.loading = false;

          this.updateAreaForm.patchValue({
            nombre: this.areaData.nombre
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

  onUpdateArea() {
    this.loading = true;

    if (this.updateAreaForm.valid) {
      this.updateAreaForm.disable();

      this.apollo
        .mutate({
          mutation: updateArea,
          variables: {
            data:  {
              'nombre': this.updateAreaForm.value.nombre
            },
            where : {
              id: this.areaId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateAreaForm.enable();

            if (data) {
              this.snackBar.open(
                `Area ${
                  data.updateArea.nombre
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'area']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateAreaForm.enable();
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
    this.areaQuerySubscription.unsubscribe();
  }
}
