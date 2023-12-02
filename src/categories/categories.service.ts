import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prismaClient: PrismaClient) {}
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string }> {
    try {
      const { description } = createCategoryDto;

      await this.prismaClient.category.create({
        data: {
          description,
        },
      });

      return { message: 'Cadastro realizado com sucesso' };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(): Promise<any> {
    const categories = await this.prismaClient.category.findMany();
    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return updateCategoryDto;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
