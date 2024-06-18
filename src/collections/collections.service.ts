import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CollectionsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(userId: string, createCollectionDto: CreateCollectionDto) {
    try {
      return this.prismaClient.productCollection.create({
        data: {
          ...createCollectionDto,
          userId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao adicionar produto a coleção.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(userId: string) {
    try {
      return await this.prismaClient.productCollection.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao listar produtos da coleção.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(userId: string, id: string) {
    try {
      return await this.prismaClient.productCollection.findFirstOrThrow({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao listar produtos da coleção.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    try {
      return await this.prismaClient.productCollection.update({
        where: {
          id,
        },
        data: {
          ...updateCollectionDto,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao editar status do produto da coleção.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(userId: string, id: string) {
    try {
      return await this.prismaClient.productCollection.update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao remover produto da coleção.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
