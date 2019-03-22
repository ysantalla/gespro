import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';

import { AreaResolver } from './resolvers/area.resolver';
import { TipoResolver } from './resolvers/tipo.resolver';
import { MesResolver } from './resolvers/mes.resolver';
import { AnnoResolver } from './resolvers/anno.resolver';
import { PagoResolver } from './resolvers/pago.resolver';
import { ProyectoResolver } from './resolvers/proyecto.resolver';
import { IntegranteResolver } from './resolvers/integrante.resolver';
import { AlcanceResolver } from './resolvers/alcance.resolver';
import { EjeResolver } from './resolvers/eje.resolver';
import { LineaResolver } from './resolvers/linea.resolver';

@Module({
    imports: [CommonModule],
    providers: [TipoResolver, AreaResolver, MesResolver, AnnoResolver, ProyectoResolver, IntegranteResolver, PagoResolver, AlcanceResolver, EjeResolver, LineaResolver],
})
export class ProyectoModule {}
