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
import { Linea, LineaCreateInput, LineaConnection, LineaUpdateInput, LineaWhereUniqueInput, BatchPayload, LineaWhereInput } from '../../../generated/prisma.ts/index';

@Resolver('Linea')
export class LineaResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('lineas')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async lineas(
    @Args() args: any,
  ): Promise<Linea[]> {
    return await this.db.prisma.lineas(args);
  }

  @Query('linea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async linea(
    @Args('id') id: string,
  ): Promise<Linea> {
    const linea =  await this.db.prisma.$exists.linea({id});

    if (!linea) {
      throw new ApolloError(`Linea no encontrado para este id ${id}`);
    }
    return await this.db.prisma.linea({ id });
  }

  @Query('lineasConnection')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async lineasConnection(): Promise<LineaConnection> {
    const fragment = `
      fragment lineaesConnection on Linea {
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

    return await this.db.prisma.lineasConnection().$fragment(fragment);
  }

  @Query('existLinea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existLinea(@Args('where') where: LineaWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.user(where);
  }

  @Mutation('createLinea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createLinea(
    @Args('data') data: LineaCreateInput,
  ): Promise<Linea> {
    const lineaExist = await this.db.prisma.$exists.linea({ nombre: data.nombre });

    if (lineaExist) {
      throw new ApolloError(`Error, ya existe un linea con este nombre (${data.nombre})`);
    }
    return await this.db.prisma.createLinea(data);
  }

  @Mutation('updateLinea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateLinea(
    @Args('data') data: LineaUpdateInput,
    @Args('where') where: LineaWhereUniqueInput,
  ): Promise<Linea> {
    const lineaExist = await this.db.prisma.$exists.linea({ id: where.id });

    if (!lineaExist) {
      throw new ApolloError(`No se encuentra un Linea para este id ${where.id}`);
    }

    return await this.db.prisma.updateLinea(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteLinea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteLinea(
    @Args('where') where: LineaWhereUniqueInput,
  ): Promise<Linea> {
    const lineaExist = await this.db.prisma.$exists.linea({ id: where.id });

    if (!lineaExist) {
      throw new ApolloError(`No se encuentra el Linea para este id ${where.id}`);
    }

    return await this.db.prisma.deleteLinea(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyLineas')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyLineas(
    @Args('where') where: LineaWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyLineas({
      ...where,
    });
  }
}
