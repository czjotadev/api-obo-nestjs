import { Module } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorsController } from './collaborators.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService, PrismaClient],
})
export class CollaboratorsModule {}
