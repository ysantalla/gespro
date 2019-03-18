import { Args, Query, Resolver, Context, Mutation, ResolveProperty, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ApolloError } from 'apollo-server-core';

import * as jwt from 'jsonwebtoken';

import { AuthGuard } from '../../common/guards/auth.guard';

import { AdService } from '../services/ad.service';
import { AuthService } from '../../common/services/auth.service';
import { PrismaService } from '../../common/services/prisma.service';
import { User } from '../../../generated/prisma.ts/index';


@Resolver('Auth')
export class AuthResolver {

  constructor(
    private readonly db: PrismaService,
    private readonly authService: AuthService,
    private readonly adService: AdService,
  ) {}

  @Query('me')
  @UseGuards(AuthGuard)
  async me(@Context('token') token: string): Promise<User> {
    const id = this.authService.getUserId(token, process.env.APP_SECRET);
    return await this.db.prisma.user({id});
  }

  @Mutation('login')
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<any> {

    const fragment = `
        fragment login on User {
          id
          username
          firstname
          lastname
          email
          employeeNumber
          roles {
            id
            name
          }
        }
      `;

    const user =  await this.db.prisma.$exists.user({username});

    console.log(user)

    try {
      const responseAD = await this.adService.login(
        username, password, 'sAMAccountName,givenName,sn,mail,employeeNumber');

      console.log(responseAD, "yasmany");

      if (!user) {
        const newUser = await this.db.prisma.createUser({
          username: (responseAD.data['0'].samaccountname['0']).trim(),
          firstname: (responseAD.data['0'].givenname['0']).trim(),
          lastname: (responseAD.data['0'].sn['0']).trim(),
          fullname: `${(responseAD.data['0'].givenname['0']).trim()} ${(responseAD.data['0'].sn['0']).trim()}`,
          email: (responseAD.data['0'].mail['0']).trim(),
          employeeNumber: (responseAD.data['0'].employeenumber['0']).trim(),
          roles: {
            connect: {
              name: "PROFESOR"
            }
          }
        }).$fragment(fragment);

        return {
          token: jwt.sign(
            {
              user: newUser,
            },
            process.env.APP_SECRET,
            {
              expiresIn: '24h',
            },
          ),
          user: newUser,
        };
      } else {
        const updateUser = await this.db.prisma.updateUser(
          {
            where: {
              username,
          },
            data: {
              username: (responseAD.data['0'].samaccountname['0']).trim(),
              firstname: (responseAD.data['0'].givenname['0']).trim(),
              lastname: (responseAD.data['0'].sn['0']).trim(),
              fullname: `${(responseAD.data['0'].givenname['0']).trim()} ${(responseAD.data['0'].sn['0']).trim()}`,
              email: (responseAD.data['0'].mail['0']).trim(),
              employeeNumber: (responseAD.data['0'].employeenumber['0']).trim(),
            },
          }).$fragment(fragment);

        return {
          token: jwt.sign(
            {
              user: updateUser,
            },
            process.env.APP_SECRET,
            {
              expiresIn: '24h',
            },
          ),
          user: updateUser,
        };
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'ENOTFOUND') {
        throw new ApolloError('Error de red, no se conecta con la API-AD');
      } else if (error.response) {
          if (error.response.status === 404) {
            throw new ApolloError('Por favor verifique que su usuario o contraseña sean correctos');
          }
          throw new ApolloError('Error desconocido');
      } else {
        throw new ApolloError(error);
      }
    }
  }

}
