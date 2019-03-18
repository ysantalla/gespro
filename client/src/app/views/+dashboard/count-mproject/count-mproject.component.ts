import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { AuthService } from '@app/core/services/auth.service';


@Component({
  selector: 'app-count-mproject',
  template: `
    <div fxLayout="row">
      <div fxFlex="80" fxLayout="row"  fxLayoutAlign="center center">
        <mat-icon>{{icon}}</mat-icon>
        <span class="spacer"></span>
        <span class="span-count">{{count}}</span>
      </div>
    </div>
  `,
  styles: [`
    .span-count {
      font-size: 70px;
    }

    mat-icon {
      font-size: 80px;
      width: 70px;
      height: 80px;
      margin-bottom: 20px;
    }
  `]
})
export class CountMProjectComponent implements OnInit, OnDestroy {

  count = 0;
  @Input() entity = 0;
  @Input() icon = '';

  username = '';

  loading: boolean;
  private querySubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private authService: AuthService) {}

  ngOnInit() {

    // We use the gql tag to parse our query string into a query document
    const connection = gql`
    query ${this.entity}Connection($where: ProyectoWhereInput) {
      ${this.entity}Connection(where: $where) {
          aggregate {
          count
        }
      }
    }
    `;

    this.username = this.authService.getUser().username;

    this.querySubscription = this.apollo.watchQuery<any>({
      query: connection,
      variables: {
        where: {integrantes_some: {
          usuario: {
            username: this.username
          },
          jefeProyecto: true
        }}
      },
      fetchPolicy: 'cache-and-network',
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;

        if (!loading) {
          this.count = data[`${this.entity}Connection`].aggregate.count;
        }
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
