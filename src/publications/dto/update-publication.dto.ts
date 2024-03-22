import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdatePublicationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  publicationCategoryId?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
