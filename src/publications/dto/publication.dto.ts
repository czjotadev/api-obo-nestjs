import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PublicationDto {
  @IsNotEmpty()
  @IsNumber()
  id: string;

  @IsNotEmpty()
  @IsString()
  user: any;

  publicationImages: any;

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
  @IsNumber()
  publicationCategory: any;

  @IsString()
  instagram?: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;
}
