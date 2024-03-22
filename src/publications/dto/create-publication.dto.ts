import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

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
  publicationCategoryId: string;

  @IsOptional()
  @IsString()
  instagram?: string;
}
