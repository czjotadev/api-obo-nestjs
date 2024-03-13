import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, PrismaClient],
})
export class ArtistsModule {}
