import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PublicationsController],
  providers: [PublicationsService, PrismaClient],
})
export class PublicationsModule {}
