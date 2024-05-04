import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name?: string;

  @IsNumber()
  price?: number;

  @IsString()
  urlName?: string;

  @IsString()
  description?: string;

  @IsString()
  instagram?: string;

  @IsString()
  productCategoryId?: string;

  @IsBoolean()
  active?: boolean;

  @IsBoolean()
  showcase?: boolean;
}
