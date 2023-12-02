import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaClient } from '@prisma/client';
import { PublicationDto } from './dto/publication.dto';

@Injectable()
export class PublicationsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createPublicationDto: CreatePublicationDto,
  ): Promise<{ message: string }> {
    const { userId, title, caption, description, categoryId, instagram } =
      createPublicationDto;

    await this.prismaClient.publication.create({
      data: {
        userId,
        title,
        caption,
        description,
        categoryId,
        instagram,
      },
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
        user: true,
        images: true,
        title: true,
        caption: true,
        description: true,
        category: true,
        instagram: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return publication;
  }

  async findOne(id: string): Promise<PublicationDto | undefined> {
    const publication = this.prismaClient.publication.findFirst({
      where: {
        id,
      },
    });
    return publication[0];
  }

  update(id: string, updatePublicationDto: UpdatePublicationDto) {
    return updatePublicationDto;
  }

  remove(id: string) {
    return `This action removes a #${id} publication`;
  }
}
