import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreatePublicationCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
