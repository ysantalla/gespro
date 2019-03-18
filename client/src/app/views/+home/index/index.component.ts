import { Component, OnInit } from '@angular/core';


import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';
import { Role } from '@app/core/model/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response {
  roles: Role[];
}




@Injectable({
  providedIn: 'root',
})
export class AllRolesGQL extends Query<Response> {
  document = gql`
    query roles {
      roles {
        id
        name
        description
      }
    }
  `;
}


@Component({
  selector: 'app-index',
  template: `
    <a (click)="exportPDF()">Export</a>
    <ul>
      <li *ngFor="let role of roles | async">
        <mat-chip class="role" color="accent">{{role.name}}</mat-chip>
      </li>
    </ul>
  `,
  styles: []
})
export class IndexComponent implements OnInit {

  roles: Observable<Role[]>;

  // inject it
  constructor(private allRolesGQL: AllRolesGQL) {}

  exportPDF() {



  }

  ngOnInit() {
    // use it!
    this.roles = this.allRolesGQL.watch()
      .valueChanges
      .pipe(
        map(result => {
          return result.data.roles;
          }
        )
      );
  }

}
