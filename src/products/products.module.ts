import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaClient],
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload/products/images',
      }),
    }),
  ],
})
export class ProductsModule {}
