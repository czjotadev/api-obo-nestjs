import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaClient } from '@prisma/client';
import { promises as fsPromises } from 'fs';
import { ArtistsInterface } from './interfaces/artists.interface';

@Injectable()
export class ArtistsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createArtistDto: CreateArtistDto,
    files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    try {
      const { userId, biography, instagram, email, phone } = createArtistDto;

      const verifyArtist = await this.prismaClient.userArtist.findFirst({
        where: { userId, deletedAt: null },
      });

      if (verifyArtist) {
        throw new Error(
          'Erro ao cadastrar artista: Já existe um usuário com os dados informados.',
        );
      }

      const artist = await this.prismaClient.userArtist.create({
        data: {
          userId,
          biography,
          instagram,
          email,
          phone,
        },
      });

      files.map(async (file) => {
        await this.prismaClient.userArtistImage.create({
          data: {
            name: file.filename,
            path: file.path,
            userArtistId: artist.id,
          },
        });
      });

      return { message: 'Artista cadastrado com sucesso' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao cadastrar artista.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ArtistsInterface[]> {
    try {
      const artists = await this.prismaClient.userArtist.findMany({
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          id: true,
          email: true,
          instagram: true,
          biography: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          userArtistImage: {
            select: {
              id: true,
              name: true,
              path: true,
            },
            where: {
              deletedAt: null,
            },
          },
        },
        where: {
          deletedAt: null,
          active: true,
        },
      });

      return artists;
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao listar artistas.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<ArtistsInterface> {
    try {
      const artist = await this.prismaClient.userArtist.findFirstOrThrow({
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          id: true,
          email: true,
          instagram: true,
          biography: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          userArtistImage: {
            select: {
              id: true,
              name: true,
              path: true,
            },
            where: {
              deletedAt: null,
            },
          },
        },
        where: {
          id,
          deletedAt: null,
          active: true,
        },
      });

      return artist;
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao listar artistas.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
    files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    try {
      const { biography, email, phone, instagram, active } = updateArtistDto;

      const artist = await this.prismaClient.userArtist.findFirstOrThrow({
        where: { id },
      });

      await this.prismaClient.userArtist.update({
        data: {
          biography,
          email,
          phone,
          instagram,
          active,
        },
        where: { id },
      });

      if (files) {
        const artistFiles = await this.prismaClient.userArtistImage.findMany({
          where: {
            userArtistId: id,
          },
          select: {
            id: true,
            path: true,
          },
        });

        await this.removeImages(artistFiles);

        await this.prismaClient.userArtistImage.deleteMany({
          where: {
            userArtistId: id,
          },
        });

        files.map(async (file) => {
          await this.prismaClient.userArtistImage.create({
            data: {
              name: file.filename,
              path: file.path,
              userArtistId: artist.id,
            },
          });
        });
      }

      return { message: 'Artista atualizado com sucesso!' };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        { message: 'Erro ao atualizar artista.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const artists = await this.prismaClient.userArtist.findFirstOrThrow({
        where: {
          id,
          deletedAt: null,
        },
      });

      const files = await this.prismaClient.userArtistImage.findMany({
        where: {
          userArtistId: artists.id,
        },
        select: {
          id: true,
          path: true,
        },
      });

      await this.removeImages(files);

      await this.prismaClient.userArtistImage.deleteMany({
        where: {
          userArtistId: artists.id,
        },
      });

      await this.prismaClient.userArtist.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id,
        },
      });

      return { message: 'Artista removido com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao remover artista.' },
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
