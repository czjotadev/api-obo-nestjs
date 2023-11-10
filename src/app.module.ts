import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PublicationsModule } from './publications/publications.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { GuestsModule } from './guests/guests.module';
import { CollectionsModule } from './collections/collections.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    CategoriesModule,
    PublicationsModule,
    CollaboratorsModule,
    GuestsModule,
    CollectionsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
