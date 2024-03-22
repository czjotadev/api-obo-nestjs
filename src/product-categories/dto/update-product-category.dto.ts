import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductCategoryDto {
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
