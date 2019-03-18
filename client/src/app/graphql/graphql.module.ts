import {NgModule, Optional, SkipSelf, PLATFORM_ID, Inject} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {ApolloModule, Apollo} from 'apollo-angular';
import {HttpBatchLinkModule, HttpBatchLink, HttpBatchLinkHandler} from 'apollo-angular-link-http-batch';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

import { environment as env } from '@env/environment';
import { AuthService } from '@app/core/services/auth.service';
import { ApolloLink } from 'apollo-link';
import { HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { makeStateKey, TransferState, BrowserTransferStateModule } from '@angular/platform-browser';
import { ApiInterceptor } from '@app/graphql/interceptors/api.interceptor';


const STATE_KEY = makeStateKey<any>('apollo.state');

@NgModule({
  imports: [
    CommonModule,
    ApolloModule,
    HttpBatchLinkModule,
    BrowserTransferStateModule
  ],
  exports: [ApolloModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
  }],
})
export class GraphQLModule {
  cache: InMemoryCache;
  link: HttpBatchLinkHandler;

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: GraphQLModule,
    private readonly apollo: Apollo,
    private readonly transferState: TransferState,
    private readonly httpLink: HttpBatchLink,
    @Inject(PLATFORM_ID) readonly platformId: Object,
    private authService: AuthService
  ) {

    if (parentModule) {
      throw new Error('GraphqlModule is already loaded. Import only in AppModule');
    }
    // tells if it's browser or server
    const isBrowser = isPlatformBrowser(platformId);

    this.cache = new InMemoryCache({
      dataIdFromObject: object => object.id
    });
    this.link = this.httpLink.create({
      uri: env.httpLinkServer
    });

    const auth_middleware = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: new HttpHeaders().set(
          'authorization',
          `Bearer ${this.authService.getToken()}` || null
        )
      });
      return forward(operation);
    });

    this.apollo.create({
      link: auth_middleware.concat(this.link),
      cache: this.cache,
      ...(isBrowser
        ? {
            // queries with `forceFetch` enabled will be delayed
            ssrForceFetchDelay: 200,
          }
        : {
            // avoid to run twice queries with `forceFetch` enabled
            ssrMode: true,
          }),
    });

    if (isBrowser) {
      this.onBrowser();
    } else {
      this.onServer();
    }
  }

  onServer() {
    // serializes the cache and puts it under a key
    this.transferState.onSerialize(STATE_KEY, () => this.cache.extract());
  }

  onBrowser() {
    // reads the serialized cache
    const state = this.transferState.get<NormalizedCacheObject>(
      STATE_KEY,
      null,
    );
    // and puts it in the Apollo
    this.cache.restore(state);
  }

}
