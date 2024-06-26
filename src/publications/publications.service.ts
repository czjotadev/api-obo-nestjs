import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaClient } from '@prisma/client';
import { PublicationDto } from './dto/publication.dto';
import { promises as fsPromises } from 'fs';

@Injectable()
export class PublicationsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    userId: string,
    createPublicationDto: CreatePublicationDto,
    files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    const { title, caption, description, publicationCategoryId, instagram } =
      createPublicationDto;

    const publication = await this.prismaClient.publication.create({
      data: {
        userId,
        title,
        caption,
        description,
        publicationCategoryId,
        instagram,
      },
    });

    files.map(async (file) => {
      await this.prismaClient.publicationImage.create({
        data: {
          name: file.filename,
          path: file.path,
          publicationId: publication.id,
        },
      });
    });

    return { message: 'Publicação cadastrada com sucesso!' };
  }

  async findAll(): Promise<PublicationDto[] | undefined> {
    try {
      const publication = this.prismaClient.publication.findMany({
        where: {
          active: true,
          deletedAt: null,
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          publicationImages: {
            select: {
              path: true,
            },
          },
          title: true,
          caption: true,
          description: true,
          publicationCategory: {
            select: {
              title: true,
            },
          },
          instagram: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return publication;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string): Promise<PublicationDto | undefined> {
    const publication = await this.prismaClient.publication.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        publicationImages: {
          select: {
            path: true,
          },
        },
        title: true,
        caption: true,
        description: true,
        publicationCategory: {
          select: {
            title: true,
          },
        },
        instagram: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return publication;
  }

  async update(
    id: string,
    updatePublicationDto: UpdatePublicationDto,
    files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    try {
      const {
        userId,
        title,
        caption,
        description,
        publicationCategoryId,
        instagram,
        active,
      } = updatePublicationDto;

      const publication = await this.prismaClient.publication.findFirstOrThrow({
        where: { id, deletedAt: null },
      });

      await this.prismaClient.publication.update({
        data: {
          userId,
          title,
          caption,
          description,
          publicationCategoryId,
          instagram,
          active,
        },
        where: { id },
      });

      files.map(async (file) => {
        await this.prismaClient.publicationImage.create({
          data: {
            name: file.filename,
            path: file.path,
            publicationId: publication.id,
          },
        });
      });
      return { message: 'Publicação atualizado com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao atualizar a publicação.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const publication = await this.prismaClient.publication.findFirstOrThrow({
        where: {
          id,
          deletedAt: null,
        },
      });

      const files = await this.prismaClient.publicationImage.findMany({
        where: {
          publicationId: publication.id,
        },
        select: {
          id: true,
          path: true,
        },
      });

      await this.removeImages(files);

      await this.prismaClient.publicationImage.deleteMany({
        where: {
          publicationId: publication.id,
        },
      });

      await this.prismaClient.publication.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id,
        },
      });

      return { message: 'Publicação removido com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao remover Publicação.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeImages(files: { id: string; path?: string }[]) {
    try {
      files.map(async (file) => {
        fsPromises.unlink(file.path);
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao remover imagem.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
