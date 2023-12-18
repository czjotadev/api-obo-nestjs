import { IsBoolean, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsString()
  address?: string;

  @IsString()
  phone?: string;

  @IsBoolean()
  admin?: boolean;

  @IsString()
  password?: string;
}
