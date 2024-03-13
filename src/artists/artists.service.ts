import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ArtistsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createArtistDto: CreateArtistDto,
    files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    try {
      const { userId, biography, instagram, email, phone } = createArtistDto;

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

      return { message: 'This action adds a new artist' };
    } catch (error) {}
  }

  findAll() {
    return `This action returns all artists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artist`;
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} ${updateArtistDto} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
