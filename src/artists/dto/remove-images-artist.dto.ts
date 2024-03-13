/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty } from 'class-validator';

export class RemoveImagesArtistDto {
  @IsNotEmpty()
  @IsArray()
  files: { id: string }[];
}
