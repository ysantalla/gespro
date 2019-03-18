import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Eje} from '@app/graphql/types';

const updateEje = gql`
  mutation updateEje($data: EjeUpdateInput!, $where: EjeWhereUniqueInput!) {
    updateEje(data: $data, where: $where) {
      id
      nombre
    }
  }
`;

const ejeQuery = gql`
  query eje($id: String!) {
    eje(id: $id) {
      id
      nombre
    }
  }
`;


@Component({
  selector: 'app-eje-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateEjeForm" #f="ngForm" (ngSubmit)="onUpdateEje()" class="form">
            <mat-card class="eje-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar Eje</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre" formControlName="nombre">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateEjeForm.valid" aria-label="updateEje">
                  <mat-icon>mode_edit</mat-icon>
                  <span>Eje</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/eje" routerLinkActive type="button" aria-label="ejesList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de ejes</span>
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
export class EjeUpdateComponent implements OnInit, OnDestroy {
  updateEjeForm: FormGroup;
  ejeData: Eje.Eje;
  ejeId: string;
  loading = false;
  ejeQuerySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.updateEjeForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    });

    this.ejeId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateEjeForm.disable();

    this.ejeQuerySubscription = this.apollo
      .watchQuery<any>({
        query: ejeQuery,
        variables: {
          id: this.ejeId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.ejeData = data.eje;
          this.updateEjeForm.enable();
          this.loading = false;

          this.updateEjeForm.patchValue({
            nombre: this.ejeData.nombre
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

  onUpdateEje() {
    this.loading = true;

    if (this.updateEjeForm.valid) {
      this.updateEjeForm.disable();

      this.apollo
        .mutate({
          mutation: updateEje,
          variables: {
            data:  {
              'nombre': this.updateEjeForm.value.nombre
            },
            where : {
              id: this.ejeId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateEjeForm.enable();

            if (data) {
              this.snackBar.open(
                `Eje ${
                  data.updateEje.nombre
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'eje']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateEjeForm.enable();
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
    this.ejeQuerySubscription.unsubscribe();
  }
}
