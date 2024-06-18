import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from './create-collection.dto';
import { IsEnum, IsOptional } from 'class-validator';

enum Status {
  PENDENTE = 'PENDENTE',
  AGUARDANDO_ESTOQUE = 'AGUARDANDO_ESTOQUE',
  ENVIADO = 'ENVIADO',
  CANCELADO = 'CANCELADO',
  CONCLUIDO = 'CONCLUIDO',
}

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
