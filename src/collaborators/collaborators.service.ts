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

      const verifyCollaborator =
        await this.prismaClient.userCollaborator.findFirst({
          where: { userId },
        });

      if (verifyCollaborator) {
        throw new Error(
          'Erro ao cadastrar colaborador: Já existe um colaborador com os dados informados.',
        );
      }

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

  async findAll(active?: boolean) {
    try {
      const colaborators = await this.prismaClient.userCollaborator.findMany({
        where: {
          active: active == true ? true : undefined,
          deletedAt: null,
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
          active: true,
          biography: true,
        },
      });

      return colaborators;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível listar os colaboradores.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const collaborator =
        await this.prismaClient.userCollaborator.findFirstOrThrow({
          where: {
            id,
            deletedAt: null,
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
      return collaborator;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível buscar o colaborador.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateCollaboratorDto: UpdateCollaboratorDto) {
    try {
      const { biography, active } = updateCollaboratorDto;
      await this.prismaClient.userCollaborator.update({
        data: {
          biography,
          active: active === 'true' ? true : false,
        },
        where: {
          id,
          deletedAt: null,
        },
      });
      return { message: 'Atualização realizada com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível editar o colaborador.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prismaClient.userCollaborator.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id,
          deletedAt: null,
        },
      });
      return { message: 'Registro excluido com sucesso!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível remover o colaborador.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
