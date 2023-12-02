import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaClient } from '@prisma/client';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaClient],
  exports: [UsersService],
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload/users/avatar',
      }),
    }),
  ],
})
export class UsersModule {}
