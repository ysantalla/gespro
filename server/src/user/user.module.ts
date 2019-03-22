import { Module, HttpModule } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { AdService } from './services/ad.service';
import { AuthResolver } from './resolvers/auth.resolver';
import { UserResolver } from './resolvers/user.resolver';

@Module({
    imports: [CommonModule, HttpModule.register({
        timeout: 10000,
        maxRedirects: 5,
        baseURL: 'https://sync.upr.edu.cu/api',
      })],
    providers: [AuthResolver, UserResolver, AdService],
})
export class UserModule {}
