import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService, PrismaClient],
})
export class CollectionsModule {}
