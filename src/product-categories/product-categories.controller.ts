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
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { AuthGuardAdmin } from 'src/auth/guard/adm-auth.guard';

@Controller('categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @UseGuards(AuthGuardAdmin)
  @Post()
  async create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<{ id: string; message: string }> {
    return this.productCategoriesService.create(createProductCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.productCategoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productCategoriesService.findOne(id);
  }

  @UseGuards(AuthGuardAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoriesService.update(id, updateProductCategoryDto);
  }

  @UseGuards(AuthGuardAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoriesService.remove(id);
  }
}
