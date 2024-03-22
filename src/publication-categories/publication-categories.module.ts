import { Module } from '@nestjs/common';
import { PublicationCategoriesController } from './publication-categories.controller';
import { PublicationCategoriesService } from './publication-categories.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PublicationCategoriesController],
  providers: [PublicationCategoriesService, PrismaClient],
})
export class PublicationCategoriesModule {}
