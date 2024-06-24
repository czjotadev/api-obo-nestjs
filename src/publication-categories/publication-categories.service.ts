import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublicationCategoryDto } from './dto/create-publication-category.dto';
import { UpdatePublicationCategoryDto } from './dto/update-publication-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PublicationCategoriesService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createPublicationCategoryDto: CreatePublicationCategoryDto,
  ): Promise<{ id: string; message: string }> {
    const { description, active, title } = createPublicationCategoryDto;

    const category = await this.prismaClient.publicationCategory.create({
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
      const categories = await this.prismaClient.publicationCategory.findMany({
        select: {
          id: true,
          description: true,
          title: true,
          active: true,
          _count: true,
        },
        where: {
          deletedAt: null,
          Publication: {
            none: {
              deletedAt: null,
            },
          },
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
      const category =
        await this.prismaClient.publicationCategory.findFirstOrThrow({
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
        });
      return category;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível carregar os dados da categoria.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id, updatePublicationCategoryDto: UpdatePublicationCategoryDto) {
    try {
      const { title, description, active } = updatePublicationCategoryDto;

      await this.prismaClient.publicationCategory.update({
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
      await this.prismaClient.publicationCategory.update({
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
