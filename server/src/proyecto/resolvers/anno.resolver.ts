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
import { Anno, AnnoCreateInput, AnnoConnection, AnnoUpdateInput, AnnoWhereUniqueInput, BatchPayload, AnnoWhereInput } from '../../generated/prisma.ts/index';

@Resolver('Anno')
export class AnnoResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('annos')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async annos(
    @Args() args: any,
  ): Promise<Anno[]> {
    return await this.db.prisma.annoes(args);
  }

  @Query('anno')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async anno(
    @Args('id') id: string,
  ): Promise<Anno> {
    const anno =  await this.db.prisma.$exists.anno({id});

    if (!anno) {
      throw new ApolloError(`Año no encontrado para este id ${id}`);
    }
    return await this.db.prisma.anno({ id });
  }

  @Query('annosConnection')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async annosConnection(): Promise<AnnoConnection> {
    const fragment = `
      fragment annoesConnection on Anno {
        aggregate {
          count
        }
        edges {
          node {
            id
            numero
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

    return await this.db.prisma.annoesConnection().$fragment(fragment);
  }

  @Query('existAnno')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existAnno(@Args('where') where: AnnoWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.anno(where);
  }

  @Mutation('createAnno')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createRole(
    @Args('data') data: AnnoCreateInput,
  ): Promise<Anno> {
    const annoExist = await this.db.prisma.$exists.anno({ numero: data.numero });

    if (annoExist) {
      throw new ApolloError(`Error, ya existe un Año con este número (${data.numero})`);
    }
    return await this.db.prisma.createAnno(data);
  }

  @Mutation('updateAnno')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateAnno(
    @Args('data') data: AnnoUpdateInput,
    @Args('where') where: AnnoWhereUniqueInput,
  ): Promise<Anno> {
    const annoExist = await this.db.prisma.$exists.anno({ id: where.id });

    if (!annoExist) {
      throw new ApolloError(`No se encuentra un Año para este id ${where.id}`);
    }

    const anno = await this.db.prisma.$exists.anno({ numero: data.numero, id_not: where.id });

    if (anno) {
      throw new ApolloError(`Error, ya existe un Año con este número (${data.numero})`);
    }

    return await this.db.prisma.updateAnno(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteAnno')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteAnno(
    @Args('where') where: AnnoWhereUniqueInput,
  ): Promise<Anno> {
    const annoExist = await this.db.prisma.$exists.anno({ id: where.id });

    if (!annoExist) {
      throw new ApolloError(`No se encuentra el Año para este id ${where.id}`);
    }

    return await this.db.prisma.deleteAnno(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyAnnoes')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyAnnoes(
    @Args('where') where: AnnoWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyAnnoes({
      ...where,
    });
  }
}
