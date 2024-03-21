/* eslint-disable prettier/prettier */
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class AuthUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  admin?: boolean;
}
