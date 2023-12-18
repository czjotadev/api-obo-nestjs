import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthGuardAdmin } from 'src/auth/guard/adm-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('/details')
  async details(@Req() request: Request) {
    const id = request['user'].sub;
    return await this.usersService.details(id);
  }

  @UseGuards(AuthGuard)
  @Patch('/update')
  async update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const id: string = request['user'].sub;
    return await this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuardAdmin)
  @Get()
  async findAll(@Query('skip') skip: string, @Query('take') take: string) {
    return await this.usersService.findAll(+skip, +take);
  }

  @UseGuards(AuthGuardAdmin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuardAdmin)
  @Patch(':id')
  async admUpdate(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto, updateUserDto.admin);
  }

  @UseGuards(AuthGuardAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
