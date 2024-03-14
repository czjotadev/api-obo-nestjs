import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsString()
  instagram?: string;
}
