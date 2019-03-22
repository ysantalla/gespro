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
import { Area, AreaCreateInput, AreaConnection, AreaUpdateInput, AreaWhereUniqueInput, AreaWhereInput } from '../../generated/prisma.ts/index';

@Resolver('Area')
export class AreaResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('areas')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async areas(
    @Args() args: any,
  ): Promise<Area[]> {
    return await this.db.prisma.areas(args);
  }

  @Query('area')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async area(
    @Args('id') id: string,
  ): Promise<Area> {
    const area =  await this.db.prisma.$exists.area({id});

    if (!area) {
      throw new ApolloError(`Area no encontrado para este id ${id}`);
    }
    return await this.db.prisma.area({ id });
  }

  @Query('areasConnection')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async areasConnection(): Promise<AreaConnection> {
    const fragment = `
      fragment areasConnection on Area {
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

    return await this.db.prisma.areasConnection().$fragment(fragment);
  }

  @Query('existArea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existArea(@Args('where') where: AreaWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.area(where);
  }

  @Mutation('createArea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createArea(
    @Args('data') data: AreaCreateInput,
  ): Promise<Area> {
    const areaExist = await this.db.prisma.$exists.area({ nombre: data.nombre });

    if (areaExist) {
      throw new ApolloError(`Error, ya existe un area con este nombre (${data.nombre})`);
    }
    return await this.db.prisma.createArea(data);
  }

  @Mutation('updateArea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateArea(
    @Args('data') data: AreaUpdateInput,
    @Args('where') where: AreaWhereUniqueInput,
  ): Promise<Area> {
    const areaExist = await this.db.prisma.$exists.area({ id: where.id });

    if (!areaExist) {
      throw new ApolloError(`No se encuentra un Area para este id ${where.id}`);
    }

    return await this.db.prisma.updateArea(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteArea')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteArea(
    @Args('where') where: AreaWhereUniqueInput,
  ): Promise<Area> {
    const areaExist = await this.db.prisma.$exists.area({ id: where.id });

    if (!areaExist) {
      throw new ApolloError(`No se encuentra el Area para este id ${where.id}`);
    }

    return await this.db.prisma.deleteArea(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyAreas')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyAreas(
    @Args('where') where: AreaWhereInput,
  ): Promise<any> {
    return await this.db.prisma.deleteManyAreas({
      ...where,
    });
  }
}
