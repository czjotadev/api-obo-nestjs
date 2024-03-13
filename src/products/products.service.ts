import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

@Injectable()
export class ProductsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<{ message: string }> {
    try {
      const {
        userArtistId,
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
          userArtistId,
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

  async findAll(
    active: boolean,
    showcase: boolean,
    skip: number,
    take: number,
  ) {
    try {
      const products = await this.prismaClient.product.findMany({
        where: {
          active,
          showcase,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          description: true,
          category: {
            select: {
              id: true,
              description: true,
            },
          },
          createdAt: true,
        },
        skip,
        take,
      });
      return products;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível listar os produtos.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const products = await this.prismaClient.product.findFirstOrThrow({
        where: {
          id,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          description: true,
          instagram: true,
          active: true,
          category: {
            select: {
              id: true,
              description: true,
            },
          },
          userArtist: {
            select: {
              id: true,
              biography: true,
              instagram: true,
              email: true,
              phone: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      return products;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o produto.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    try {
      const {
        name,
        urlName,
        description,
        instagram,
        categoryId,
        showcase,
        active,
      } = updateProductDto;

      const product = await this.prismaClient.product.findFirstOrThrow({
        where: { id, deletedAt: null },
      });

      await this.prismaClient.product.update({
        data: {
          name,
          urlName,
          description,
          instagram,
          categoryId,
          showcase,
          active,
        },
        where: { id },
      });

      files.map(async (file) => {
        await this.prismaClient.productImage.create({
          data: {
            name: file.filename,
            path: file.path,
            productId: product.id,
          },
        });
      });
      return { message: 'Produto atualizado com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao atualizar o produto.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const product = await this.prismaClient.product.findFirstOrThrow({
        where: {
          id,
          deletedAt: null,
        },
      });

      const files = await this.prismaClient.productImage.findMany({
        where: {
          productId: product.id,
        },
        select: {
          id: true,
          path: true,
        },
      });

      await this.removeImages(files);

      await this.prismaClient.productImage.deleteMany({
        where: {
          productId: product.id,
        },
      });

      await this.prismaClient.product.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id,
        },
      });

      return { message: 'Produto removido com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao remover produto.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeImages(files: { id: string; path?: string }[]) {
    try {
      files.map(async (file) => {
        file.path
          ? await this.prismaClient.productImage.findFirstOrThrow({
              where: { id: file.id },
            })
          : fs.unlink(file.path, (err) => {
              if (err) {
                throw new Error('Erro ao excluir os arquivos.');
              }
            });
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao remover imagem.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
