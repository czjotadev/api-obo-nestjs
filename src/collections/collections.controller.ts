import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';
import { AuthGuardAdmin } from 'src/auth/guard/adm-auth.guard';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    const userId: string = request['user'].sub;
    return this.collectionsService.create(userId, createCollectionDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request: Request) {
    const userId: string = request['user'].sub;
    return this.collectionsService.findAll(userId);
  }

  @UseGuards(AuthGuardAdmin)
  @Get('admin')
  findAllAdmin() {
    return this.collectionsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    const userId: string = request['user'].sub;
    return this.collectionsService.findOne(id, userId);
  }

  @UseGuards(AuthGuardAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const userId: string = request['user'].sub;
    return this.collectionsService.remove(userId, id);
  }
}
