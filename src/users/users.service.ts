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
    try {
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
    } catch (error) {
      throw new HttpException(
        'Erro ao cadastrar o usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async details(id: string) {
    try {
      return await this.prismaClient.user.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
        where: {
          id,
          deletedAt: null,
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao consultar o usuário.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async find(authUserDto: AuthUserDto): Promise<UserDto | undefined> {
    try {
      const { email, password } = authUserDto;
      const user = await this.prismaClient.user.findFirst({
        where: {
          email,
          active: true,
          deletedAt: null,
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
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async findAll(skip: number, take: number) {
    try {
      const users = await this.prismaClient.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          admin: true,
        },
        where: {
          deletedAt: null,
        },
        skip: skip ? skip : 0,
        take: take ? take : 10,
      });

      return users;
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao listar os usuários.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: {
          id,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          admin: true,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao consultar usuário.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, admin?: boolean) {
    try {
      const { name, phone, address, password } = updateUserDto;
      const user = await this.prismaClient.user.findFirstOrThrow({
        where: {
          id,
        },
      });
      const hash = password ? await bcrypt.hash(password, 8) : user.password;
      await this.prismaClient.user.update({
        where: {
          id,
        },
        data: {
          name,
          phone,
          address,
          password: hash,
          admin: admin ? admin : false,
        },
      });
      return { message: 'Usuário atualizado com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao editar o usuário.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prismaClient.user.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
          active: false,
        },
      });
      return { message: 'Usuário removido com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Erro ao excluir usuário.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
