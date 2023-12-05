import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaClient: PrismaClient) {}
  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { name, email, password } = createUserDto;
    const hash = await bcrypt.hash(password, 8);
    const ifExists = await this.prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (ifExists)
      throw new HttpException(
        'Não é possível cadastrar um usuário com os dados informados',
        HttpStatus.BAD_REQUEST,
      );

    await this.prismaClient.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    return { message: 'Cadastro realizado com sucesso!' };
  }

  async find(authUserDto: AuthUserDto): Promise<UserDto | undefined> {
    const { email, password } = authUserDto;
    const user = await this.prismaClient.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        admin: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException();

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) throw new UnauthorizedException();

    delete user.password;

    return user;
  }

  async findAll() {
    try {
      const users = await this.prismaClient.user.findMany();

      return users;
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao listar os usuários.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
