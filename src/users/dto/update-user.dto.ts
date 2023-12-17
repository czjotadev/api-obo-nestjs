import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsString()
  address?: string;

  @IsString()
  phone?: string;

  @IsString()
  password?: string;
}
