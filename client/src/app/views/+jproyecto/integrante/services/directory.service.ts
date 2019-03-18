import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment as env } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  constructor(
    private http: HttpClient
  ) { }

  getProfesorList(fullname: string): Observable<any>  {
    const params = new HttpParams()
        .set('ldap_consulta[search_display_name]', fullname)
        .set('ldap_consulta[search_state]', '')
        .set('ldap_consulta[cookie_page]', '')
        .set('ldap_consulta[search_state]', '');
    return this.http.get<any>(`${env.directoryLink}`, { params: params  });
  }
}
