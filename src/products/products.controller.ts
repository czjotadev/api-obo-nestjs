import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuardAdmin } from 'src/auth/guard/adm-auth.guard';
import { RemoveImagesProductDto } from './dto/remove-images-product.dto';

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
    @Query('active', ParseBoolPipe) active: boolean,
    @Query('showcase', ParseBoolPipe) showcase: boolean,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return this.productsService.findAll(active, showcase, skip, take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // @UseGuards(AuthGuardAdmin)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  @UseGuards(AuthGuardAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Delete('images')
  async removeImages(@Body() removeImagesProductDto: RemoveImagesProductDto) {
    return await this.productsService.removeImages(
      removeImagesProductDto.files,
    );
  }
}
