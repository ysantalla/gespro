import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';

import { PrismaService } from '../../common/services/prisma.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

import { UserCreateInput, User, UserWhereUniqueInput, UserUpdateInput, UserWhereInput, BatchPayload, Role, UserConnection, Proyecto, Integrante } from '../../../generated/prisma.ts/index';
import { ApolloError } from 'apollo-server-core';


@Resolver('User')
export class UserResolver {
  constructor(private readonly db: PrismaService) {}

  @Query('users')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async users(
    @Args() args: any): Promise<User[]> {
      return await this.db.prisma.users(args);
  }

  @Query('user')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async user(
    @Args('id') id: string,
  ): Promise<User> {

    const user =  await this.db.prisma.$exists.user({id});

    if (!user) {
      throw new ApolloError(`Usuario no encontrado para este id ${id}`);
    }

    return await this.db.prisma.user({ id });
  }

  @Query('usersConnection')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async usersConnection(): Promise<UserConnection> {

    const fragment = `
      fragment usersConnectionWithRoles on User {
        aggregate {
          count
        }
        edges {
          node {
            id
            username
            email
            firstname
            lastname
            employeeNumber
            roles {
              id
              name
              description
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    `;

    return await this.db.prisma.usersConnection().$fragment(fragment);
  }

  @Query('existUser')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existUser(@Args('where') where: UserWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.user(where);
  }

  @Mutation('createUser')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createUser(
    @Args('data') data: UserCreateInput,
  ): Promise<User> {

    const userExist = await this.db.prisma.$exists.user({ username: data.username, email: data.email, employeeNumber: data.employeeNumber });

    if (userExist) {
      throw new ApolloError(`Error, ya existe un usuario con este (correo - numero de emplado y nombre de usuario) (${data.email} - ${data.employeeNumber} - ${data.username})`);
    }

    return await this.db.prisma.createUser(data);
  }

  @Mutation('updateUser')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateUser(
    @Args('data') data: UserUpdateInput,
    @Args('where') where: UserWhereUniqueInput,
  ): Promise<User> {

    const userExist = await this.db.prisma.$exists.user({
      id: where.id,
    });

    if (!userExist) {
      throw new ApolloError(`Usuario no encontrado para este id ${where.id}`);
    }

    const userExistValid = await this.db.prisma.$exists.user({ username: data.username, email: data.email, employeeNumber: data.employeeNumber, id_not: where.id });

    if (userExistValid) {
      throw new ApolloError(`Error, ya existe un usuario con este (correo - numero de emplado y nombre de usuario) (${data.email} - ${data.employeeNumber} - ${data.username})`);
    }

    return await this.db.prisma.updateUser(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteUser')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteUser(
    @Args('where') where: UserWhereUniqueInput,
  ): Promise<User> {

    const userExist = await this.db.prisma.$exists.user({
      id: where.id});

    if (!userExist) {
      throw new ApolloError(`Usuario no encontrado para este id ${where.id}`);
    }

    return await this.db.prisma.deleteUser(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyUsers')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyUsers(
    @Args('where') where: UserWhereInput,
  ): Promise<BatchPayload> {

    return await this.db.prisma.deleteManyUsers({
      ...where,
    });
  }

  @ResolveProperty('roles')
  async getRolesById(@Parent() user): Promise<Role[]> {
    const { id } = user;
    return await this.db.prisma.roles({where: {users_some: {id}}});
  }

  @ResolveProperty('integrantes')
  async getIntegrantesById(
    @Parent() user,
    @Args('where') where: UserWhereInput): Promise<Integrante[]> {
    const { id } = user;

    return await this.db.prisma.integrantes({...where, where: {usuario: {id: id}}});
  }

}
