import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string }> {
    const { description, active, title } = createCategoryDto;

    await this.prismaClient.category.create({
      data: {
        title,
        description,
        active: active === 'true' ? true : false,
      },
    });

    return { message: 'Cadastro realizado com sucesso' };
  }

  async findAll(): Promise<any> {
    try {
      const categories = await this.prismaClient.category.findMany({
        select: {
          id: true,
          description: true,
          title: true,
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
      const category = await this.prismaClient.category.findFirstOrThrow({
        where: {
          id,
          active: true,
        },
      });
      return category;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível carregar os dados da categorai.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    try {
      const { id, description, active } = updateCategoryDto;

      await this.prismaClient.category.update({
        data: {
          description,
          active: active === 'true' ? true : false,
        },
        where: {
          id,
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
      await this.prismaClient.category.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id,
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
