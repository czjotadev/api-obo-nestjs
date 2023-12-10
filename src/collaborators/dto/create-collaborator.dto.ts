import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollaboratorDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  biography: string;

  @IsNotEmpty()
  @IsString()
  active: string;
}
