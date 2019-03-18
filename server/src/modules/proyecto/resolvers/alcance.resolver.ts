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
import { Alcance, AlcanceCreateInput, AlcanceConnection, AlcanceUpdateInput, AlcanceWhereUniqueInput, BatchPayload, AlcanceWhereInput } from '../../../generated/prisma.ts/index';

@Resolver('Alcance')
export class AlcanceResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('alcances')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async alcances(
    @Args() args: any,
  ): Promise<Alcance[]> {
    return await this.db.prisma.alcances(args);
  }

  @Query('alcance')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async alcance(
    @Args('id') id: string,
  ): Promise<Alcance> {
    const alcance =  await this.db.prisma.$exists.alcance({id});

    if (!alcance) {
      throw new ApolloError(`Alcance no encontrado para este id ${id}`);
    }
    return await this.db.prisma.alcance({ id });
  }

  @Query('alcancesConnection')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async alcanceesConnection(): Promise<AlcanceConnection> {
    const fragment = `
      fragment alcanceesConnection on Alcance {
        aggregate {
          count
        }
        edges {
          node {
            id
            nombre
            valor
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

    return await this.db.prisma.alcancesConnection().$fragment(fragment);
  }

  @Query('existAlcance')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existAlcance(@Args('where') where: AlcanceWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.user(where);
  }

  @Mutation('createAlcance')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createRole(
    @Args('data') data: AlcanceCreateInput,
  ): Promise<Alcance> {
    const alcanceExist = await this.db.prisma.$exists.alcance({ nombre: data.nombre });

    if (alcanceExist) {
      throw new ApolloError(`Error, ya existe un alcance con este nombre (${data.nombre})`);
    }
    return await this.db.prisma.createAlcance(data);
  }

  @Mutation('updateAlcance')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateAlcance(
    @Args('data') data: AlcanceUpdateInput,
    @Args('where') where: AlcanceWhereUniqueInput,
  ): Promise<Alcance> {
    const alcanceExist = await this.db.prisma.$exists.alcance({ id: where.id });

    if (!alcanceExist) {
      throw new ApolloError(`No se encuentra un Alcance para este id ${where.id}`);
    }

    return await this.db.prisma.updateAlcance(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteAlcance')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteAlcance(
    @Args('where') where: AlcanceWhereUniqueInput,
  ): Promise<Alcance> {
    const alcanceExist = await this.db.prisma.$exists.alcance({ id: where.id });

    if (!alcanceExist) {
      throw new ApolloError(`No se encuentra el Alcance para este id ${where.id}`);
    }

    return await this.db.prisma.deleteAlcance(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyAlcances')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyAlcancees(
    @Args('where') where: AlcanceWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyAlcances({
      ...where,
    });
  }
}
