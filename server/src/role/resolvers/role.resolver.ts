import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { ApolloError } from 'apollo-server-core';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

import { PrismaService } from '../../common/services/prisma.service';
import { Role, RoleCreateInput, RoleUpdateInput, RoleWhereUniqueInput, BatchPayload, RoleWhereInput, RoleConnection } from '../../generated/prisma.ts/index';

@Resolver('Role')
export class RoleResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('roles')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async roles(
    @Args() args: any,
  ): Promise<Role[]> {
    return await this.db.prisma.roles(args);
  }

  @Query('role')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async role(
    @Args('id') id: string,
  ): Promise<Role> {
    const role =  await this.db.prisma.$exists.role({id});

    if (!role) {
      throw new ApolloError(`Rol no encontrado para este id ${id}`);
    }
    return await this.db.prisma.role({ id });
  }

  @Query('rolesConnection')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async rolesConnection(): Promise<RoleConnection> {
    const fragment = `
      fragment rolesConnection on Role {
        aggregate {
          count
        }
        edges {
          node {
            id
            name
            description
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

    return await this.db.prisma.rolesConnection().$fragment(fragment);
  }

  @Query('existRole')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existRole(@Args('where') where: RoleWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.role(where);
  }

  @Mutation('createRole')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async createRole(
    @Args('data') data: RoleCreateInput,
  ): Promise<Role> {
    const roleExist = await this.db.prisma.$exists.role({ name: data.name });

    if (roleExist) {
      throw new ApolloError(`Error, ya existe un rol con este nombre (${data.name})`);
    }
    return await this.db.prisma.createRole(data);
  }

  @Mutation('updateRole')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async updateRole(
    @Args('data') data: RoleUpdateInput,
    @Args('where') where: RoleWhereUniqueInput,
  ): Promise<any> {
    const roleExist = await this.db.prisma.$exists.role({ id: where.id });

    if (!roleExist) {
      throw new ApolloError(`No se encuentra el Rol para este id ${where.id}`);
    }

    return await this.db.prisma.updateRole(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteRole')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async deleteRole(
    @Args('where') where: RoleWhereUniqueInput,
  ): Promise<any> {
    const roleExist = await this.db.prisma.$exists.role({ id: where.id });

    if (!roleExist) {
      throw new ApolloError(`No se encuentra el Rol para este id ${where.id}`);
    }

    return await this.db.prisma.deleteRole(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyRoles')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async deleteManyRoles(
    @Args('where') where: RoleWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyRoles({
      ...where,
    });
  }
}
