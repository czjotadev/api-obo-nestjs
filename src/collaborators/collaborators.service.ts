import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CollaboratorsService {
  constructor(private prismaClient: PrismaClient) {}
  async create(createCollaboratorDto: CreateCollaboratorDto) {
    try {
      const { userId, biography, active } = createCollaboratorDto;
      await this.prismaClient.userCollaborator.create({
        data: {
          userId,
          biography,
          active: active === 'true' ? true : false,
        },
      });

      return { message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível cadastrar o usuário colaborador.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    const colaborators = await this.prismaClient.userCollaborator.findMany({
      where: {
        active: true,
        deletedAt: '',
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        biography: true,
      },
    });

    return colaborators;
  }

  async findOne(id: string) {
    const collaborator =
      await this.prismaClient.userCollaborator.findFirstOrThrow({
        where: {
          id,
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          biography: true,
          active: true,
        },
      });
    return collaborator;
  }

  async update(id: string, updateCollaboratorDto: UpdateCollaboratorDto) {
    const { biography, active } = updateCollaboratorDto;
    await this.prismaClient.userCollaborator.update({
      data: {
        biography,
        active: active === 'true' ? true : false,
      },
      where: {
        id,
      },
    });
    return { message: 'Atualização realizada com sucesso!' };
  }

  async remove(id: string) {
    await this.prismaClient.userCollaborator.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
    return { message: 'Registro excluido com sucesso!' };
  }
}
