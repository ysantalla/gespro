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
import { Pago, PagoCreateInput, PagoWhereUniqueInput, PagoWhereInput, PagoUpdateInput, PagoConnection, BatchPayload, IntegranteWhereInput, Integrante, Mes, Anno } from '../../generated/prisma.ts/index';

const TOTAL_HOURS = process.env.TOTAL_HOURS;

@Resolver('Pago')
export class PagoResolver {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Query('pagos')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO', 'PROFESOR')
  @UseGuards(RolesGuard)
  async pagos(
    @Args() args: any,
  ): Promise<Pago[]> {
    console.log(args, "yasmany");
    return await this.db.prisma.pagoes(args);
  }

  @Query('pago')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO', 'PROFESOR')
  @UseGuards(RolesGuard)
  async pago(
    @Args('id') id: string,
  ): Promise<Pago> {
    const pago =  await this.db.prisma.$exists.pago({id});

    if (!pago) {
      throw new ApolloError(`Pago no encontrado para este id ${id}`);
    }
    return await this.db.prisma.pago({ id });
  }

  @Query('pagosConnection')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async pagosConnection(): Promise<PagoConnection> {

    const fragment = `
      fragment pagosConnection  on Pago {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              integrante {
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
              }
              mes{
                  id
                  nombre
                  habilitado
              }
              anno {
                  id
                  numero
                  habilitado
              }
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
            cursor
          }
          aggregate {
            count
          }
        }
    `;
    return await this.db.prisma.pagoesConnection().$fragment(fragment);
  }

  @Query('existPago')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async existPago(@Args('where') where: PagoWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.pago(where);
  }

  @Mutation('createPago')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async createPago(
    @Args('data') data: PagoCreateInput,
    @Args('whereInput') whereInput: PagoWhereInput,
  ): Promise<Pago> {

    const project = await this.db.prisma.integrante({id: whereInput.integrante.id}).proyecto();

    if (project.estado === "CERRADO") {
      throw new ApolloError(`Proyecto CERRADO contacte al especialista`);
    }

    if (new Date(project.finaliza).getTime() < Date.now()) {
      throw new ApolloError(`Proyecto finalizado`);
    }

    const monthValid = await this.db.prisma.$exists.mes({id: whereInput.mes.id, habilitado: false});

    if (monthValid) {
      throw new ApolloError(`Mes de ${whereInput.mes.id} no esta habilitado, para realizar pago`);
    }

    const yearValid = await this.db.prisma.$exists.anno({id: whereInput.anno.id, habilitado: false});

    if (yearValid) {
      throw new ApolloError(`Año ${whereInput.anno.id} no esta habilitado, para realizar pago`);
    }

    const isValid = await this.db.prisma.$exists.pago({integrante: whereInput.integrante, anno: whereInput.anno, mes: whereInput.mes});

    if (isValid) {
      throw new ApolloError(`Ya existe un pago para este usuario, en este mes y año`);
    }

    const pagos: Pago[] = await this.db.prisma.pagoes({where: {integrante: {usuario: whereInput.integrante.usuario}, anno: whereInput.anno, mes: whereInput.mes}});

    if (pagos.length > 0) {
      const totalHours: number = pagos.map((data => data.horas)).reduce((a, b) => {
        return a + b;
      });
  
      if (parseFloat(TOTAL_HOURS) < totalHours) {
        throw new ApolloError(`El total de horas excede en ${totalHours - parseFloat(TOTAL_HOURS)} de horas permitidas`);
      }
    }

    const integrante = await this.db.prisma.integrante({id: whereInput.integrante.id});
    const alcance = await this.db.prisma.integrante({id: whereInput.integrante.id}).proyecto().alcance();

    data.calculo = this.__calculo(data, alcance.valor, integrante.jefeProyecto);
    
    return await this.db.prisma.createPago(data);
  }

  __calculo(data: PagoCreateInput | PagoUpdateInput, alcance: number, jproyecto=false): number {

    let pago = 0;

    if (jproyecto) {
      pago = 20;
    }

    return parseFloat(((((data.horas / 190.6 * 20) + ((data.complejidad + data.gestion + data.vinculacion) / 30 * 40) + ((data.gestion + data.significacion + data.cumplimiento) / 30 * 40)) / 100 * alcance) + pago).toFixed(1));

  }

  @Mutation('updatePago')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async updatePago(
    @Args('data') data: PagoUpdateInput,
    @Args('where') where: PagoWhereUniqueInput,
    @Args('whereInput') whereInput: PagoWhereInput,
  ): Promise<Pago> {
    const pagoExist = await this.db.prisma.$exists.pago({ id: where.id });

    if (!pagoExist) {
      throw new ApolloError(`No se encuentra un Pago para este id ${where.id}`);
    }
    
    const project = await this.db.prisma.integrante({id: whereInput.integrante.id}).proyecto();

    if (project.estado === "CERRADO") {
      throw new ApolloError(`Proyecto CERRADO contacte al especialista`);
    }

    if (new Date(project.finaliza).getTime() < Date.now()) {
      throw new ApolloError(`Proyecto finalizado`);
    }

    const monthValid = await this.db.prisma.$exists.mes({id: whereInput.mes.id, habilitado: false});

    if (monthValid) {
      throw new ApolloError(`Mes de id ${whereInput.mes.id} no esta habilitado, para realizar pago`);
    }

    const yearValid = await this.db.prisma.$exists.anno({id: whereInput.anno.id, habilitado: false});

    if (yearValid) {
      throw new ApolloError(`Año de id ${whereInput.anno.id} no esta habilitado, para realizar pago`);
    }

    const isValid = await this.db.prisma.$exists.pago({integrante: whereInput.integrante, anno: whereInput.anno, mes: whereInput.mes, id_not: where.id});

    if (isValid) {
      throw new ApolloError(`Ya existe un pago para este usuario, en este mes y año`);
    }

    const pagos: Pago[] = await this.db.prisma.pagoes({where: {integrante: {usuario: whereInput.integrante.usuario}, anno: whereInput.anno, mes: whereInput.mes, id_not: where.id}});

    if (pagos.length > 0) {
      const totalHours: number = pagos.map((data => data.horas)).reduce((a, b) => {
        return a + b;
      });
  
      if (parseFloat(TOTAL_HOURS) < totalHours) {
        throw new ApolloError(`El total de horas excede en ${totalHours - parseFloat(TOTAL_HOURS)} de horas permitidas`);
      }
    }

    const integrante = await this.db.prisma.integrante({id: whereInput.integrante.id});
    const alcance = await this.db.prisma.integrante({id: whereInput.integrante.id}).proyecto().alcance();

    data.calculo = this.__calculo(data, alcance.valor, integrante.jefeProyecto);

    return await this.db.prisma.updatePago(
      {
        where: { ...where },
        data: {
          ...data,
        },
      },
    );
  }

  @Mutation('deletePago')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async deletePago(
    @Args('where') where: PagoWhereUniqueInput,
  ): Promise<any> {
    const pagoExist = await this.db.prisma.$exists.pago({ id: where.id });

    if (!pagoExist) {
      throw new ApolloError(`No se encuentra el Pago para este id ${where.id}`);
    }

    return await this.db.prisma.deletePago(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyPagos')
  @Roles('ADMIN', 'ESPECIALISTA', 'JPROYECTO')
  @UseGuards(RolesGuard)
  async deleteManyPagos(
    @Args('where') where: PagoWhereInput,
  ): Promise<BatchPayload> {
    return await this.db.prisma.deleteManyPagoes({
      ...where,
    });
  }

  @ResolveProperty('integrante')
  async getIntegranteById(
    @Parent() pago,
    @Args('where') where: any): Promise<Integrante> {
    const { id } = pago;
    return await this.db.prisma.pago({id}).integrante();
  }

  @ResolveProperty('mes')
  async getMesById(@Parent() pago): Promise<Mes> {
    const { id } = pago;
    return await this.db.prisma.pago({id}).mes();
  }

  @ResolveProperty('anno')
  async getAnnoById(@Parent() pago): Promise<Anno> {
    const { id } = pago;
    return await this.db.prisma.pago({id}).anno();
  }

}
