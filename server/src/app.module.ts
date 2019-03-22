import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { importSchema } from 'graphql-import';

import * as path from 'path';
import * as GraphQLJSON from 'graphql-type-json';
import { AppController } from './app.controller';

import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

import { RoleModule } from './role/role.module';
import { FileModule } from './file/file.module';
import { ProyectoModule } from './proyecto/proyecto.module';

const typeDefs = importSchema(path.resolve('./src/schema.graphql'));

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      typeDefs,
      resolvers: { JSON: GraphQLJSON },
      uploads: true,
      introspection: true,
      context: async ({ req, res, connection, payload }) => {
        let token: string = null;
        if (payload) {
          token = payload.authorization || '';
          return {
            connection,
            payload,
            token: token.replace('Bearer ', ''),
          };
        }
        token = req.headers.authorization || '';
        return {
          req,
          res,
          token: token.replace('Bearer ', ''),
        };
      },
      debug: true,
      subscriptions: {
        path: process.env.GRAPHQL_SUBSCRIPTION,
      },
      path: process.env.GRAPHQL_PATH,
    }),
    CommonModule,
    UserModule,
    RoleModule,
    FileModule,
    ProyectoModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class ApplicationModule {}
