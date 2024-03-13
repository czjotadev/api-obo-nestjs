/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty } from 'class-validator';

export class RemoveImagesProductDto {
  @IsNotEmpty()
  @IsArray()
  files: { id: string }[];
}
