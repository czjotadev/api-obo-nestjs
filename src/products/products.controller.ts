import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuardAdmin } from 'src/auth/guard/adm-auth.guard';
import { RemoveImagesProductDto } from './dto/remove-images-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const storage = diskStorage({
  destination: './upload/products/images',
  filename: (req, file, cb) => {
    const extension = extname(file.originalname);
    const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${randomName}${extension}`);
  },
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuardAdmin)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    return this.productsService.create(createProductDto, files);
  }

  @Get()
  findAll(
    @Query('active') active?: boolean,
    @Query('showcase') showcase?: boolean,
  ) {
    return this.productsService.findAll(
      active ? true : undefined,
      showcase ? true : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuardAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productsService.update(id, updateProductDto, files);
  }

  @UseGuards(AuthGuardAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(AuthGuardAdmin)
  @Delete('images')
  async removeImages(@Body() removeImagesProductDto: RemoveImagesProductDto) {
    return await this.productsService.removeImages(
      removeImagesProductDto.files,
    );
  }
}
