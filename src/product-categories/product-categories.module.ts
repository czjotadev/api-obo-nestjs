import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, PrismaClient],
})
export class ProductCategoriesModule {}
