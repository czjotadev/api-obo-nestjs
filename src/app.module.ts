import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PublicationsModule } from './publications/publications.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { CollectionsModule } from './collections/collections.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/upload',
    }),
    ProductsModule,
    UsersModule,
    CategoriesModule,
    PublicationsModule,
    CollaboratorsModule,
    CollectionsModule,
    AuthModule,
    ArtistsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
