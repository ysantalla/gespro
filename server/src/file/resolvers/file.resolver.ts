import { UseGuards, Logger } from '@nestjs/common';

import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { ApolloError } from 'apollo-server-core';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileService } from '../../common/services/file.service';

import { PrismaService } from '../../common/services/prisma.service';
import { File, FileCreateInput, FileConnection, FileWhereUniqueInput, FileWhereInput, BatchPayload } from '../../generated/prisma.ts/index';

@Resolver('File')
export class FileResolver {
  constructor(
    private readonly db: PrismaService,
    private readonly fileService: FileService,
  ) {}

  @Query('files')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async files(
    @Args() args: any,
  ): Promise<File[]> {
    return await this.db.prisma.files(args);
  }

  @Query('file')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async file(
    @Args('id') id: string,
  ): Promise<any> {
    const file =  await this.db.prisma.$exists.file({id});

    if (!file) {
      throw new ApolloError(`Archivo no encontrado para este id ${id}`);
    }
    return await this.db.prisma.file({ id });
  }

  @Query('filesConnection')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async filesConnection(): Promise<FileConnection> {
    const fragment = `
      fragment filesConnection on File {
        aggregate {
          count
        }
        edges {
          node {
            id
            path
            filename
            mimetype
            encoding
            size
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

    return await this.db.prisma.filesConnection().$fragment(fragment);
  }

  @Query('existFile')
  @Roles('ADMIN', 'ESPECIALISTA')
  @UseGuards(RolesGuard)
  async existFile(@Args('where') where: FileWhereInput): Promise<boolean> {
    return await this.db.prisma.$exists.file(where);
  }

  @Mutation('uploadFile')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async uploadFile(
    @Args('file') file: any,
  ): Promise<File> {
    const data: FileCreateInput = await this.fileService.storeFS(file);
    return await this.db.prisma.createFile(data);
  }

  @Mutation('uploadFiles')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async uploadFiles(
    @Args('files') files: any,
  ): Promise<any> {

    return await Promise.all(files.map(async (file) =>  {
      const data: any = await this.fileService.storeFS(file);
      return await this.db.prisma.createFile(data);
    }));
  }

  @Mutation('changeFile')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async changeFile(
    @Args('file') file: any,
    @Args('where') where: FileWhereUniqueInput,
  ): Promise<File> {

    const fileExist = await this.db.prisma.$exists.file({ id: where.id });

    if (!fileExist) {
      throw new ApolloError(`No se encuentra el Archivo para este id ${where.id}`);
    }

    const oldFile = await this.db.prisma.file({id: where.id});

    try {
      await this.fileService.removeFS(oldFile.path);
    } catch (error) {
      Logger.warn(error);
    }

    const data: any = await this.fileService.storeFS(file);

    return await this.db.prisma.updateFile(
      {
        where: { ...where },
        data: { ...data },
      },
    );
  }

  @Mutation('deleteFile')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async deleteFile(
    @Args('where') where: FileWhereUniqueInput,
  ): Promise<File> {

    const fileExist = await this.db.prisma.$exists.file({ id: where.id });

    if (!fileExist) {
      throw new ApolloError(`No se encuentra el Archivo para este id ${where.id}`);
    }

    const file = await this.db.prisma.file({id: where.id});

    try {
      await this.fileService.removeFS(file.path) ;
    } catch (error) {
      Logger.warn(error);
    }

    return await this.db.prisma.deleteFile(
      {
        ...where,
      },
    );
  }

  @Mutation('deleteManyFiles')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async deleteManyFiles(
    @Args('where') where: FileWhereInput,
  ): Promise<BatchPayload> {

    const files = await this.db.prisma.files({where: {...where}});
    const datas = await Promise.all(files.map(async (file) => {
      try {
        return await this.fileService.removeFS(file.path);
      } catch (error) {
        Logger.warn(error);
      }
    }));

    return await this.db.prisma.deleteManyFiles({
      ...where,
    },
    );
  }

}
