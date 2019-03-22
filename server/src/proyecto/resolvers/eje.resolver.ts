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
import { Eje, EjeCreateInput, EjeConnection, EjeUpdateInput, EjeWhereUniqueInput, BatchPayload, EjeWhereInput } from '../../generated/prisma.ts/index';

@Resolver('Eje')
export class EjeResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('ejes')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async ejes(
    @Args() args: any,
  ): Promise<Eje[]> {
    return await this.db.prisma.ejes(args);
  }

  @Query('eje')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async eje(
    @Args('id') id: string,
  ): Promise<Eje> {
    const eje =  await this.db.prisma.$exists.eje({id});

    if (!eje) {
      throw new ApolloError(`Eje no encontrado para este id ${id}`);
    }
    return await this.db.prisma.eje({ id });
  }

  @Query('ejesConnection')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async ejeesConnection(): Promise<EjeConnection> {
    const fragment = `
      fragment ejeesConnection on Eje {
        aggregate {
          count
        }
        edges {
          node {
            id
            nombre
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

    return await this.db.prisma.ejesConnection().$fragment(fragment);
  }

  @Query('existEje')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existEje(@Args('where') where: EjeWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.user(where);
  }

  @Mutation('createEje')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createEje(
    @Args('data') data: EjeCreateInput,
  ): Promise<Eje> {
    const ejeExist = await this.db.prisma.$exists.eje({ nombre: data.nombre });

    if (ejeExist) {
      throw new ApolloError(`Error, ya existe un eje con este nombre (${data.nombre})`);
    }
    return await this.db.prisma.createEje(data);
  }

  @Mutation('updateEje')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateEje(
    @Args('data') data: EjeUpdateInput,
    @Args('where') where: EjeWhereUniqueInput,
  ): Promise<Eje> {
    const ejeExist = await this.db.prisma.$exists.eje({ id: where.id });

    if (!ejeExist) {
      throw new ApolloError(`No se encuentra un Eje para este id ${where.id}`);
    }

    return await this.db.prisma.updateEje(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteEje')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteEje(
    @Args('where') where: EjeWhereUniqueInput,
  ): Promise<Eje> {
    const ejeExist = await this.db.prisma.$exists.eje({ id: where.id });

    if (!ejeExist) {
      throw new ApolloError(`No se encuentra el Eje para este id ${where.id}`);
    }

    return await this.db.prisma.deleteEje(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyEjes')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyEjees(
    @Args('where') where: EjeWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyEjes({
      ...where,
    });
  }
}
