import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AuthenticationError } from 'apollo-server-core';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private readonly authService: AuthService,
      private readonly reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean {

    const ctx = GqlExecutionContext.create(context);
    const user = this.authService.getUser(ctx.getContext().token, process.env.APP_SECRET);

    if (user) {
        return true;
    }
    throw new AuthenticationError('Not valid user');
  }
}