import { IsString } from 'class-validator';

export class UpdateCollaboratorDto {
  @IsString()
  biography?: string;

  @IsString()
  active?: string;
}
