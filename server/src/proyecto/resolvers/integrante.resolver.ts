import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';

import { ApolloError } from 'apollo-server-core';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

import { PrismaService } from '../../common/services/prisma.service';
import { Integrante, IntegranteCreateInput, IntegranteWhereInput, IntegranteConnection, IntegranteWhereUniqueInput, BatchPayload, Pago, User, Proyecto, ProyectoWhereInput, PagoWhereInput, UserConnection } from '../../generated/prisma.ts';


@Resolver('Integrante')
export class IntegranteResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('integrantes')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO', 'PROFESOR')
  @UseGuards(RolesGuard)
  async integrantes(
    @Args() args: any,
  ): Promise<Integrante[]> {
    return await this.db.prisma.integrantes(args);
  }

  @Query('integrante')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO', 'PROFESOR')
  @UseGuards(RolesGuard)
  async integrante(
    @Args('id') id: string,
  ): Promise<Integrante> {
    const integrante =  await this.db.prisma.$exists.integrante({id});

    if (!integrante) {
      throw new ApolloError(`Integrante no encontrado para este id ${id}`);
    }

    return await this.db.prisma.integrante({ id });
  }

  @Query('integrantesConnection')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async integrantesConnection(
    @Args('where') where: IntegranteWhereInput
  ): Promise<IntegranteConnection> {
    const fragment = `
      fragment integrantesConnection on Integrante {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
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
              eje {
                id
                nombre
              }
              linea {
                id
                nombre
              }
              tipo {
                id
                nombre
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
          cursor
        }
        aggregate {
          count
        }
      }
    `;

    return await this.db.prisma.integrantesConnection({where}).$fragment(fragment);
  }

  @Query('existIntegrante')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO', 'PROFESOR')
  @UseGuards(RolesGuard)
  async existIntegrante(
    @Args('where') where: IntegranteWhereInput,
    ): Promise<boolean> {
    return await this.db.prisma.$exists.user(where);
  }

  @Mutation('createIntegrante')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async createIntegrante(
    @Args('data') data: IntegranteCreateInput,
    @Args('whereInput') whereInput: IntegranteWhereInput,
  ): Promise<Integrante> {

    const isValid = await this.db.prisma.$exists.integrante({usuario: whereInput.usuario, proyecto: whereInput.proyecto});

    if (isValid) {
      throw new ApolloError(`Ya existe este usuario para este proyecto`);
    }

    const fragment = `
        fragment userRoles on User {
          id
          username
          firstname
          lastname
          email
          employeeNumber
          roles {
            id
            name
          }
        }
      `;

    const user: any = await this.db.prisma.user({username: whereInput.usuario.username}).$fragment(fragment);

    if (data.jefeProyecto && user) {
      const isValidJProject = await this.db.prisma.$exists.integrante({jefeProyecto: true, proyecto: whereInput.proyecto});

      if (isValidJProject) {
        throw new ApolloError(`Ya existe un jefe para este proyecto`);
      }

      if (user.roles.filter(data => data.name !== "JPROYECTO")) {
        const jproyecto = await this.db.prisma.updateUser({where: {username: whereInput.usuario.username}, data: {roles: {connect: {name: "JPROYECTO"}}}});
      }

      return await this.db.prisma.createIntegrante(
        {
          usuario: {connect: {username: whereInput.usuario.username}},
          ...data
        });
    } else if (!data.jefeProyecto && user) { 

      return await this.db.prisma.createIntegrante(
        {
          usuario: {connect: {username: whereInput.usuario.username}},
          proyecto: data.proyecto,
          jefeProyecto: data.jefeProyecto
        });
    }

    return await this.db.prisma.createIntegrante(data);
  }

  @Mutation('updateIntegrante')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async updateIntegrante(
    @Args('data') data: IntegranteCreateInput,
    @Args('where') where: IntegranteWhereUniqueInput,
    @Args('whereInput') whereInput: IntegranteWhereInput,
  ): Promise<Integrante> {

    const isValid = await this.db.prisma.$exists.integrante({usuario: whereInput.usuario, proyecto: whereInput.proyecto, id_not: where.id});

    if (isValid) {
      throw new ApolloError(`Ya existe este usuario para este proyecto`);
    }

    const fragment = `
        fragment userRoles on User {
          id
          username
          firstname
          lastname
          email
          employeeNumber
          roles {
            id
            name
          }
        }
      `;

    const user: any = await this.db.prisma.user({username: whereInput.usuario.username}).$fragment(fragment);

    if (data.jefeProyecto && user) {
      const isValidJProject = await this.db.prisma.$exists.integrante({jefeProyecto: true, proyecto: whereInput.proyecto, id_not: where.id});

      if (isValidJProject) {
        throw new ApolloError(`Ya existe un jefe para este proyecto`);
      }

      if (user.roles.filter(data => data.name !== "JPROYECTO")) {
        const jproyecto = await this.db.prisma.updateUser({where: {username: whereInput.usuario.username}, data: {roles: {connect: {name: "JPROYECTO"}}}});
      }

      return await this.db.prisma.updateIntegrante({
        where: { ...where },
        data: {
          usuario: {connect: {username: whereInput.usuario.username}},
          proyecto: data.proyecto,
          jefeProyecto: data.jefeProyecto
        }});
    } else if (!data.jefeProyecto && user) { 
      
      return await this.db.prisma.updateIntegrante({
        where: { ...where },
        data: {
          usuario: {connect: {username: whereInput.usuario.username}},
          ...data
        }});
    }

    return await this.db.prisma.updateIntegrante(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deleteIntegrante')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async deleteIntegrante(
    @Args('where') where: IntegranteWhereUniqueInput,
  ): Promise<Integrante> {
    const integranteExist = await this.db.prisma.$exists.integrante({ id: where.id });

    if (!integranteExist) {
      throw new ApolloError(`No se encuentra el Integrante para este id ${where.id}`);
    }

    return await this.db.prisma.deleteIntegrante(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyIntegrantes')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async deleteManyIntegrantes(
    @Args('where') where: IntegranteWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyIntegrantes({
      ...where,
    });
  }

  @ResolveProperty('pagos')
  async getPagosById(
    @Parent() integrante, 
    @Args('where') where: PagoWhereInput): Promise<Pago[]> {
    const { id } = integrante;
    return await this.db.prisma.pagoes({where: {...where, integrante: {id}}});
  }

  @ResolveProperty('usuario')
  async getUserById(@Parent() integrante): Promise<User> {
    const { id } = integrante;
    return await this.db.prisma.integrante({id}).usuario();
  }

  @ResolveProperty('proyecto')
  async getProyectoById(
    @Parent() integrante): Promise<Proyecto> {
    const { id } = integrante;
    return await this.db.prisma.integrante({id}).proyecto();
  }
}
