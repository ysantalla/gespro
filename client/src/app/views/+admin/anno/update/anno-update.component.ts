import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import {Annos} from '@app/graphql/types';

const updateAnno = gql`
  mutation updateAnno($data: AnnoUpdateInput!, $where: AnnoWhereUniqueInput!) {
    updateAnno(data: $data, where: $where) {
      id
      numero
      habilitado
    }
  }
`;

const annoQuery = gql`
  query anno($id: String!) {
    anno(id: $id) {
      id
      numero
      habilitado
    }
  }
`;


@Component({
  selector: 'app-anno-update',
  template: `
    <div class="loading">
      <mat-progress-bar value="indeterminate" *ngIf="loading" color="warn"></mat-progress-bar>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="updateAnnoForm" #f="ngForm" (ngSubmit)="onUpdateAnno()" class="form">
            <mat-card class="anno-card">
              <mat-card-header>
                <mat-card-title>
                  <h1 class="mat-h1">Modificar Año</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <mat-form-field class="full-width">
                  <input matInput required type="number" placeholder="Numero" formControlName="numero">
                </mat-form-field>

                <mat-checkbox formControlName="habilitado">Habilitado</mat-checkbox>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!updateAnnoForm.valid" aria-label="updateAnno">
                  <mat-icon>mode_edit</mat-icon>
                  <span>Año</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/year" routerLinkActive type="button" aria-label="annosList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de años</span>
                </button>
              </mat-card-actions>
            </mat-card>
          </form>
        </div>
      </div>
    </div>

  `,
  styles: [
    `.full-width {
        width: 100%;
      }
    `
  ]
})
export class AnnoUpdateComponent implements OnInit, OnDestroy {
  updateAnnoForm: FormGroup;
  annoData: Annos.Annos;
  annoId: string;
  loading = false;
  annoQuerySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.updateAnnoForm = this.formBuilder.group({
      numero: ['', Validators.required],
      habilitado: ['']
    });

    this.annoId = this.activatedRoute.snapshot.params['id'];

    this.loading = true;
    this.updateAnnoForm.disable();

    this.annoQuerySubscription = this.apollo
      .watchQuery<any>({
        query: annoQuery,
        variables: {
          id: this.annoId
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        if (!loading) {
          this.annoData = data.anno;
          this.updateAnnoForm.enable();
          this.loading = false;

          this.updateAnnoForm.patchValue({
            numero: this.annoData.numero,
            habilitado: this.annoData.habilitado
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

  onUpdateAnno() {
    this.loading = true;

    if (this.updateAnnoForm.valid) {
      this.updateAnnoForm.disable();

      this.apollo
        .mutate({
          mutation: updateAnno,
          variables: {
            data:  {
              'numero': this.updateAnnoForm.value.numero,
              'habilitado': this.updateAnnoForm.value.habilitado,
            },
            where : {
              id: this.annoId
            }
          }
        })
        .subscribe(
          ({ data }) => {
            this.loading = false;
            this.updateAnnoForm.enable();

            if (data) {
              this.snackBar.open(
                `Año ${
                  data.updateAnno.numero
                } editado correctamente`,
                'X',
                { duration: 3000 }
              );
              this.router.navigate(['admin', 'year']);
            }
          },
          (error) => {
            this.loading = false;
            this.updateAnnoForm.enable();
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
    this.annoQuerySubscription.unsubscribe();
  }
}
