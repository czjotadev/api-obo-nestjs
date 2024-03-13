import { IsBoolean, IsString } from 'class-validator';

export class UpdatePublicationDto {
  @IsString()
  userId?: string;

  @IsString()
  title?: string;

  @IsString()
  caption?: string;

  @IsString()
  description?: string;

  @IsString()
  categoryId?: string;

  @IsString()
  instagram?: string;

  @IsBoolean()
  active?: boolean;
}
