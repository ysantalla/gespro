import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadService } from '@app/core/services/upload.service';
import { isObject } from 'util';


@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private uploadService: UploadService
  ) {
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Support to Upload Files and progress
    if (req.url === "http://directorio.upr.edu.cu/search") {
      return next.handle(req);
    }

    if (req.body.some((item: any) => (item.operationName !== 'uploadFiles') && (item.operationName !== 'changeFile'))) {
      return next.handle(req);
    }

    const files = this.__extractFiles(req.body);

    if (files.length) {

      const headers = req.headers.delete('content-type');
      const body = new FormData();
      body.append('operations', JSON.stringify(req.body));

      body.append(
        'map',
        JSON.stringify(
          files.reduce((map1, _ref2, index) => {
            const path = _ref2.path;
            map1[''.concat(index.toString())] = [path];
            return map1;
          }, {})
        )
      );

      files.forEach((_ref3, index) => {
        const file = _ref3.file;
        return body.append(index.toString(), file, file.name);
      });

      const newReq = req.clone({
        headers: headers,
        body: body,
        reportProgress: true
      });

      return next.handle(newReq).pipe(
        map((event: any) => {
          this.uploadService.setPercent(event);
          return event;
        })
      );
    }

    return next.handle(req);
  }

  __extractFiles(tree, treePath = '') {

    const files = [];
    const recurse = ((node, nodePath) => {

      Object.keys(node).forEach(key => {
        if (!isObject(node[key])) {
          return;
        }

        const path = '' + nodePath + key;

        if ((typeof File !== 'undefined' && node[key] instanceof File) || (typeof Blob !== 'undefined' && node[key] instanceof Blob)) {
          files.push({
            path: path,
            file: node[key]
          });
          node[key] = null;
          return;
        }

        if (typeof FileList !== 'undefined' && node[key] instanceof FileList) {
          node[key] = Array.prototype.slice.call(node[key]);
        }

        recurse(node[key], path + '.');
      });
    });

    recurse(tree, treePath === '' ? treePath : treePath + '.');
    return files;
  }
}
