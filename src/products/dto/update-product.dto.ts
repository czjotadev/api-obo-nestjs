import { IsBoolean, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name?: string;

  @IsString()
  urlName?: string;

  @IsString()
  description?: string;

  @IsString()
  instagram?: string;

  @IsString()
  categoryId?: string;

  @IsBoolean()
  active?: boolean;

  @IsBoolean()
  showcase?: boolean;
}
