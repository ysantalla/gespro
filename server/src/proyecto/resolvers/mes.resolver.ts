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
import { Mes, MesCreateInput, MesConnection, MesUpdateInput, MesWhereUniqueInput, BatchPayload, MesWhereInput } from '../../generated/prisma.ts/index';

@Resolver('Mes')
export class MesResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('meses')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async mess(
    @Args() args: any,
  ): Promise<Mes[]> {
    return await this.db.prisma.meses(args);
  }

  @Query('mes')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async mes(
    @Args('id') id: string,
  ): Promise<Mes> {
    const mes =  await this.db.prisma.$exists.mes({id});

    if (!mes) {
      throw new ApolloError(`Mes no encontrado para este id ${id}`);
    }
    return await this.db.prisma.mes({ id });
  }

  @Query('mesesConnection')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async mesesConnection(): Promise<MesConnection> {
    const fragment = `
      fragment mesesConnection on Mes {
        aggregate {
          count
        }
        edges {
          node {
            id
            nombre
            habilitado
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

    return await this.db.prisma.mesesConnection().$fragment(fragment);
  }

  @Query('existMes')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existMes(@Args('where') where: MesWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.mes(where);
  }

  @Mutation('createMes')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createRole(
    @Args('data') data: MesCreateInput,
  ): Promise<Mes> {
    const mesExist = await this.db.prisma.$exists.mes({ nombre: data.nombre });

    if (mesExist) {
      throw new ApolloError(`Error, ya existe un mes con este nombre (${data.nombre})`);
    }
    return await this.db.prisma.createMes(data);
  }

  @Mutation('updateMes')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateMes(
    @Args('data') data: MesUpdateInput,
    @Args('where') where: MesWhereUniqueInput,
  ): Promise<Mes> {
    const mesExist = await this.db.prisma.$exists.mes({ id: where.id });

    if (!mesExist) {
      throw new ApolloError(`No se encuentra un Mes para este id ${where.id}`);
    }

    const mes = await this.db.prisma.$exists.mes({ nombre: data.nombre, id_not: where.id});

    if (mes) {
      throw new ApolloError(`Error, ya existe un mes con este nombre (${data.nombre})`);
    }

    return await this.db.prisma.updateMes(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteMes')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteMes(
    @Args('where') where: MesWhereUniqueInput,
  ): Promise<Mes> {
    const mesExist = await this.db.prisma.$exists.mes({ id: where.id });

    if (!mesExist) {
      throw new ApolloError(`No se encuentra el Mes para este id ${where.id}`);
    }

    return await this.db.prisma.deleteMes(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyMeses')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyMeses(
    @Args('where') where: MesWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyMeses({
      ...where,
    });
  }
}
