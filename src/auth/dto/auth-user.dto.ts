/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class AuthUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  admin?: boolean;
}
