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
  create(
    @Body() createArtistDto: CreateArtistDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.artistsService.create(createArtistDto, files);
  }

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistsService.update(+id, updateArtistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistsService.remove(+id);
  }
}
