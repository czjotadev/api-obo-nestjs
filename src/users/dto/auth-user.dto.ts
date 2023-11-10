import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class AuthUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
