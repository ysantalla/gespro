import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Alcance} from '@app/graphql/types';

const updateAlcance = gql`
  mutation updateAlcance($data: AlcanceUpdateInput!, $where: AlcanceWhereUniqueInput!) {
    updateAlcance(data: $data, where: $where) {
      id
      nombre
    }
  }
`;

const alcanceQuery = gql`
  query alcance($id: String!) {
    alcance(id: $id) {
      id
      nombre
      valor
    }
  }
`;


@Component({
  selector: 'app-alcance-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateAlcanceForm" #f="ngForm" (ngSubmit)="onUpdateAlcance()" class="form">
            <mat-card class="alcance-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar el Alcance de Proyecto</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="text" placeholder="Nombre" formControlName="nombre">
                </mat-form-field>

                <mat-form-field class="full-width">
                  <input matInput required type="number" placeholder="Valor" formControlName="valor">
                </mat-form-field>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateAlcanceForm.valid" aria-label="updateAlcance">
                  <mat-icon>mode_edit</mat-icon>
                  <span>Alcance</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/alcance"
                 routerLinkActive type="button" aria-label="alcancesList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de alcances</span>
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
export class AlcanceUpdateComponent implements OnInit, OnDestroy {
  updateAlcanceForm: FormGroup;
  alcanceData: Alcance.Alcance;
  alcanceId: string;
  loading = false;
  alcanceQuerySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.updateAlcanceForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      valor: ['', Validators.required]
    });

    this.alcanceId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateAlcanceForm.disable();

    this.alcanceQuerySubscription = this.apollo
      .watchQuery<any>({
        query: alcanceQuery,
        variables: {
          id: this.alcanceId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.alcanceData = data.alcance;
          this.updateAlcanceForm.enable();
          this.loading = false;

          this.updateAlcanceForm.patchValue({
            nombre: this.alcanceData.nombre,
            valor: this.alcanceData.valor,
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

  onUpdateAlcance() {
    this.loading = true;

    if (this.updateAlcanceForm.valid) {
      this.updateAlcanceForm.disable();

      this.apollo
        .mutate({
          mutation: updateAlcance,
          variables: {
            data:  {
              'nombre': this.updateAlcanceForm.value.nombre,
              'valor': this.updateAlcanceForm.value.valor,
            },
            where : {
              id: this.alcanceId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateAlcanceForm.enable();

            if (data) {
              this.snackBar.open(
                `Alcance ${
                  data.updateAlcance.nombre
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'alcance']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateAlcanceForm.enable();
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
    this.alcanceQuerySubscription.unsubscribe();
  }
}
