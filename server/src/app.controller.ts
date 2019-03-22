import * as fs from 'fs';
import * as path from 'path';

import { Get, Controller, Param, Res } from '@nestjs/common';
import { PrismaService } from './common/services/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly db: PrismaService,
  ) {}

  @Get('download/:id')
  async download(
      @Param('id') id: string,
      @Res() res: any,
  ) {
    const file = await this.db.prisma.file({id});
    const filePath = path.join('.', file.path);
    if (fs.existsSync(filePath)) {
        res.header('Content-disposition', 'attachament; filename=' + file.filename);
        res.header('Content-type', file.mimetype);
        res.download(filePath, file.filename);
    } else {
        res.write('Archivo no encontrado');
    }
  }
}
