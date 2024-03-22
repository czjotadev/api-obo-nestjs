import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PublicationCategoriesService } from './publication-categories.service';
import { CreatePublicationCategoryDto } from './dto/create-publication-category.dto';
import { UpdatePublicationCategoryDto } from './dto/update-publication-category.dto';
import { AuthGuardAdmin } from 'src/auth/guard/adm-auth.guard';

@Controller('publication-categories')
export class PublicationCategoriesController {
  constructor(
    private readonly publicationCategoriesService: PublicationCategoriesService,
  ) {}

  @UseGuards(AuthGuardAdmin)
  @Post()
  async create(
    @Body() createPublicationCategoryDto: CreatePublicationCategoryDto,
  ): Promise<{ id: string; message: string }> {
    return this.publicationCategoriesService.create(
      createPublicationCategoryDto,
    );
  }

  @Get()
  async findAll() {
    return await this.publicationCategoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.publicationCategoriesService.findOne(id);
  }

  @UseGuards(AuthGuardAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicationCategoryDto: UpdatePublicationCategoryDto,
  ) {
    return this.publicationCategoriesService.update(
      id,
      updatePublicationCategoryDto,
    );
  }

  @UseGuards(AuthGuardAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationCategoriesService.remove(id);
  }
}
