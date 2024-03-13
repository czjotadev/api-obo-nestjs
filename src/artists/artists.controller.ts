import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuardAdmin } from 'src/auth/guard/adm-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ArtistsInterface } from './interfaces/artists.interface';
import { RemoveImagesArtistDto } from './dto/remove-images-artist.dto';

const storage = diskStorage({
  destination: './upload/artists/images',
  filename: (req, file, cb) => {
    const extension = extname(file.originalname);
    const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${randomName}${extension}`);
  },
});

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @UseGuards(AuthGuardAdmin)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  async create(
    @Body() createArtistDto: CreateArtistDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    return this.artistsService.create(createArtistDto, files);
  }

  @Get()
  async findAll(): Promise<ArtistsInterface[]> {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ArtistsInterface> {
    return await this.artistsService.findOne(id);
  }

  @UseGuards(AuthGuardAdmin)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    return await this.artistsService.update(id, updateArtistDto, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.artistsService.remove(id);
  }

  @Delete('images')
  async removeImages(@Body() removeImagesArtistDto: RemoveImagesArtistDto) {
    return await this.artistsService.removeImages(removeImagesArtistDto.files);
  }
}
