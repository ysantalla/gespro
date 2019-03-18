import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';


@Component({
  selector: 'app-count-entity',
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
export class CountEntityComponent implements OnInit, OnDestroy {

  count = 0;
  @Input() entity = 0;
  @Input() icon = '';

  loading: boolean;
  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {

    // We use the gql tag to parse our query string into a query document
    const connection = gql`
    query ${this.entity}Connection {
      ${this.entity}Connection {
          aggregate {
          count
        }
      }
    }
    `;

    this.querySubscription = this.apollo.watchQuery<any>({
      query: connection,
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
