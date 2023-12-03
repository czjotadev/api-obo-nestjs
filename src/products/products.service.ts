import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<{ message: string }> {
    try {
      const {
        userId,
        name,
        urlName,
        description,
        instagram,
        categoryId,
        showcase,
        active,
      } = createProductDto;

      const product = await this.prismaClient.product.create({
        data: {
          userId,
          name,
          urlName,
          description,
          instagram,
          categoryId,
          showcase: showcase === 'true' ? true : false,
          active: active === 'true' ? true : false,
        },
      });

      files.map(async (file) => {
        await this.prismaClient.productImage.create({
          data: {
            name: file.filename,
            path: file.path,
            productId: product.id,
            extension: file.mimetype,
          },
        });
      });

      return { message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível cadastrar o produto.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
