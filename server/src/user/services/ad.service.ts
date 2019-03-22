import { HttpService, Injectable } from '@nestjs/common';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

@Injectable()
export class AdService {
  constructor(
      private readonly httpService: HttpService,
    ) {}

  login(user: string, password: string, ...params): Promise<any> {
    return this.httpService.get(`/apilogin/${user}/${password}/${params}`).toPromise();
  }
}