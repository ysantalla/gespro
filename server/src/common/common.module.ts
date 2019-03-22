import { Module } from '@nestjs/common';
import { DateScalar } from './scalars/date.scalar';
import { AuthService } from './services/auth.service';
import { FileService } from './services/file.service';
import { PrismaService } from './services/prisma.service';

@Module({
  providers: [DateScalar, AuthService, PrismaService, FileService],
  exports: [AuthService, PrismaService, FileService],
})
export class CommonModule {}
