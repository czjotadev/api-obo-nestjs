import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductCategoriesService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<{ id: string; message: string }> {
    const { description, active, title } = createProductCategoryDto;

    const category = await this.prismaClient.productCategory.create({
      data: {
        title,
        description,
        active,
      },
      select: {
        id: true,
      },
    });

    return { id: category.id, message: 'Cadastro realizado com sucesso' };
  }

  async findAll(): Promise<any> {
    try {
      const categories = await this.prismaClient.productCategory.findMany({
        select: {
          id: true,
          description: true,
          title: true,
          active: true,
          _count: true,
        },
        where: {
          deletedAt: null,
        },
      });
      return categories;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível carregar os dados das categorais.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prismaClient.productCategory.findFirstOrThrow(
        {
          select: {
            id: true,
            title: true,
            description: true,
            active: true,
          },
          where: {
            id,
            deletedAt: null,
          },
        },
      );
      return category;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível carregar os dados da categoria.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id, updateProductCategoryDto: UpdateProductCategoryDto) {
    try {
      const { title, description, active } = updateProductCategoryDto;

      await this.prismaClient.productCategory.update({
        data: {
          title,
          description,
          active,
          updatedAt: new Date(),
        },
        where: {
          id,
          deletedAt: null,
        },
      });

      return { message: 'Categoria atualizada com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao atualizar a categoria.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prismaClient.productCategory.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id,
          deletedAt: null,
        },
      });

      return { message: 'Ação realizada com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível excluir a categoria.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
