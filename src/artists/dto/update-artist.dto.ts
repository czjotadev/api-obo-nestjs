import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateArtistDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  biography?: string;

  @IsString()
  instagram?: string;

  @IsString()
  email?: string;

  @IsString()
  phone?: string;

  @IsBoolean()
  active?: boolean;
}
