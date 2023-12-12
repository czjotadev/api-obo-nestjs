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
  Req,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationDto } from './dto/publication.dto';
import { AuthGuardAdmin } from 'src/auth/guard/adm-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './upload/publications/images',
  filename: (req, file, cb) => {
    const extension = extname(file.originalname);
    const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${randomName}${extension}`);
  },
});

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @UseGuards(AuthGuardAdmin)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  async create(
    @Body() createPublicationDto: CreatePublicationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const userId = request['user'].sub;
    return this.publicationsService.create(userId, createPublicationDto, files);
  }

  @Get()
  async findAll(): Promise<PublicationDto[] | undefined> {
    return this.publicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }

  @UseGuards(AuthGuardAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationsService.update(id, updatePublicationDto);
  }

  @UseGuards(AuthGuardAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationsService.remove(id);
  }
}
