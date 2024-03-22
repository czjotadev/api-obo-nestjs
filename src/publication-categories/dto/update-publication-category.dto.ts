import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePublicationCategoryDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  active?: boolean;
}
