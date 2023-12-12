import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaClient } from '@prisma/client';
import { PublicationDto } from './dto/publication.dto';

@Injectable()
export class PublicationsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    userId: string,
    createPublicationDto: CreatePublicationDto,
    files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    const { title, caption, description, categoryId, instagram } =
      createPublicationDto;

    const publication = await this.prismaClient.publication.create({
      data: {
        userId,
        title,
        caption,
        description,
        categoryId,
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
    const publication = this.prismaClient.publication.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        images: {
          select: {
            path: true,
          },
        },
        title: true,
        caption: true,
        description: true,
        category: {
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
        images: {
          select: {
            path: true,
          },
        },
        title: true,
        caption: true,
        description: true,
        category: {
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

  update(id: string, updatePublicationDto: UpdatePublicationDto) {
    return updatePublicationDto;
  }

  remove(id: string) {
    return `This action removes a #${id} publication`;
  }
}
