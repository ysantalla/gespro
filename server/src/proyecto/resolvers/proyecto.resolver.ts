import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveProperty,
  Parent
} from '@nestjs/graphql';

import { ApolloError } from 'apollo-server-core';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

import { PrismaService } from '../../common/services/prisma.service';
import {
  Proyecto,
  ProyectoCreateInput,
  ProyectoWhereInput,
  ProyectoUpdateInput,
  ProyectoWhereUniqueInput,
  BatchPayload,
  Integrante,
  Area,
  Tipo,
  Alcance,
  Eje,
  Linea
} from '../../generated/prisma.ts/index';

@Resolver('Proyecto')
export class ProyectoResolver {
  constructor(private readonly db: PrismaService) {}

  @Query('proyectos')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO', 'PROFESOR')
  @UseGuards(RolesGuard)
  async proyectos(@Args('where') where: ProyectoWhereInput): Promise<Proyecto[]> {
    return await this.db.prisma.proyectoes({where});
  }

  @Query('proyecto')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO', 'PROFESOR')
  @UseGuards(RolesGuard)
  async proyecto(@Args('id') id: string): Promise<Proyecto> {
    const proyecto = await this.db.prisma.$exists.proyecto({ id });

    if (!proyecto) {
      throw new ApolloError(`Proyecto no encontrado para este id ${id}`);
    }

    return await this.db.prisma.proyecto({ id });
  }

  @Query('proyectosConnection')
  @UseGuards(RolesGuard)
  async proyectosConnection(
    @Args('where') where: ProyectoWhereInput
  ): Promise<any> {
    const fragment = `
      fragment proyectosConnection on Proyecto {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            codigo
            nombre
            inicia
            finaliza
            area {
              id
              nombre
            }
            tipo {
              id
              nombre
            }
            eje {
              id
              nombre
            }
            linea {
              id
              nombre
            }
            alcance {
              id
              nombre
              valor
            }
            estado
            integrantes {
              id
              proyecto {
                id
                codigo
                nombre
                inicia
                finaliza
                estado
                area {
                  id
                  nombre
                }
                tipo {
                  id
                  nombre
                }
                eje {
                  id
                  nombre
                }
                linea {
                  id
                  nombre
                }
                alcance {
                  id
                  nombre
                  valor
                }
              }
              jefeProyecto
              usuario {
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
              pagos {
                id
                horas
                presencia
                incidencia
                relevancia
                complejidad
                gestion
                vinculacion
                calidad
                significacion
                cumplimiento
                calculo
              }
            }
          }
          cursor
        }
        aggregate {
          count
        }
      }
    `;

    return await this.db.prisma.proyectoesConnection({where}).$fragment(fragment);
  }

  @Query('existProyecto')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existProyecto(
    @Args('where') where: ProyectoWhereInput
  ): Promise<boolean> {
    return await this.db.prisma.$exists.user(where);
  }

  @Mutation('createProyecto')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async createProyecto(
    @Args('data') data: ProyectoCreateInput
  ): Promise<Proyecto> {

    const isValidProject = await this.db.prisma.$exists.proyecto(
      {
        OR: [{codigo: data.codigo}, {nombre: data.nombre}]
      });

    if (isValidProject) {
      throw new ApolloError(
        `Error, ya existe un proyecto para este código - nombre (${data.codigo} - ${data.nombre})`
      );
    }

    return await this.db.prisma.createProyecto(data);
  }

  @Mutation('updateProyecto')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async updateProyecto(
    @Args('data') data: ProyectoUpdateInput,
    @Args('where') where: ProyectoWhereUniqueInput
  ): Promise<any> {
    const proyectoExist = await this.db.prisma.$exists.proyecto({
      id: where.id
    });

    if (!proyectoExist) {
      throw new ApolloError(
        `No se encuentra un Proyecto para este id ${where.id}`
      );
    }

    const isValidProject = await this.db.prisma.$exists.proyecto(
      {
        OR: [{codigo: data.codigo}, {nombre: data.nombre}],
        id_not: where.id
      });

    if (isValidProject) {
      throw new ApolloError(
        `Error, ya existe un proyecto para este código - nombre (${data.codigo} - ${data.nombre})`
      );
    }

    return await this.db.prisma.updateProyecto({
      where: { ...where },
      data: {
        ...data
      }
    });
  }

  @Mutation('deleteProyecto')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteProyecto(
    @Args('where') where: ProyectoWhereUniqueInput
  ): Promise<Proyecto> {
    const proyectoExist = await this.db.prisma.$exists.proyecto({
      id: where.id
    });

    if (!proyectoExist) {
      throw new ApolloError(
        `No se encuentra el Proyecto para este id ${where.id}`
      );
    }

    return await this.db.prisma.deleteProyecto({
      ...where
    });
  }

  @Mutation('deleteManyProyectos')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async deleteManyProyectos(
    @Args('where') where: ProyectoWhereInput
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyProyectoes({
      ...where
    });
  }

  @ResolveProperty('integrantes')
  async getIntegrantesById(
    @Parent() proyecto,
    @Args('where') where: ProyectoWhereInput,
    ): Promise<Integrante[]> {
    const { id } = proyecto;
    return await this.db.prisma.integrantes({ where: {...where, proyecto: {id}}});
  }

  @ResolveProperty('area')
  async getAreaById(@Parent() proyecto): Promise<Area> {
    const { id } = proyecto;
    return await this.db.prisma.proyecto({ id }).area();
  }

  @ResolveProperty('tipo')
  async getTipoById(@Parent() proyecto): Promise<Tipo> {
    const { id } = proyecto;
    return await this.db.prisma.proyecto({ id }).tipo();
  }

  @ResolveProperty('eje')
  async getEjeById(@Parent() proyecto): Promise<Eje> {
    const { id } = proyecto;
    return await this.db.prisma.proyecto({ id }).eje();
  }

  @ResolveProperty('linea')
  async getLineById(@Parent() proyecto): Promise<Linea> {
    const { id } = proyecto;
    return await this.db.prisma.proyecto({ id }).linea();
  }

  @ResolveProperty('alcance')
  async getAlcanceById(@Parent() proyecto): Promise<Alcance> {
    const { id } = proyecto;
    return await this.db.prisma.proyecto({ id }).alcance();
  }
}
