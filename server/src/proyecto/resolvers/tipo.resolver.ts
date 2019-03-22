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
import { Tipo, TipoCreateInput, TipoConnection, TipoUpdateInput, TipoWhereUniqueInput, BatchPayload, TipoWhereInput } from '../../generated/prisma.ts/index';

@Resolver('Tipo')
export class TipoResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('tipos')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async tipos(
    @Args() args: any,
  ): Promise<Tipo[]> {
    return await this.db.prisma.tipoes(args);
  }

  @Query('tipo')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async tipo(
    @Args('id') id: string,
  ): Promise<Tipo> {
    const tipo =  await this.db.prisma.$exists.tipo({id});

    if (!tipo) {
      throw new ApolloError(`Tipo no encontrado para este id ${id}`);
    }
    return await this.db.prisma.tipo({ id });
  }

  @Query('tiposConnection')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async tipoesConnection(): Promise<TipoConnection> {
    const fragment = `
      fragment tipoesConnection on Tipo {
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

    return await this.db.prisma.tipoesConnection().$fragment(fragment);
  }

  @Query('existTipo')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existTipo(@Args('where') where: TipoWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.user(where);
  }

  @Mutation('createTipo')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createTipo(
    @Args('data') data: TipoCreateInput,
  ): Promise<Tipo> {
    const tipoExist = await this.db.prisma.$exists.tipo({ nombre: data.nombre });

    if (tipoExist) {
      throw new ApolloError(`Error, ya existe un tipo con este nombre (${data.nombre})`);
    }
    return await this.db.prisma.createTipo(data);
  }

  @Mutation('updateTipo')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateTipo(
    @Args('data') data: TipoUpdateInput,
    @Args('where') where: TipoWhereUniqueInput,
  ): Promise<Tipo> {
    const tipoExist = await this.db.prisma.$exists.tipo({ id: where.id });

    if (!tipoExist) {
      throw new ApolloError(`No se encuentra un Tipo para este id ${where.id}`);
    }

    return await this.db.prisma.updateTipo(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteTipo')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteTipo(
    @Args('where') where: TipoWhereUniqueInput,
  ): Promise<Tipo> {
    const tipoExist = await this.db.prisma.$exists.tipo({ id: where.id });

    if (!tipoExist) {
      throw new ApolloError(`No se encuentra el Tipo para este id ${where.id}`);
    }

    return await this.db.prisma.deleteTipo(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyTipos')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyTipoes(
    @Args('where') where: TipoWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyTipoes({
      ...where,
    });
  }
}
