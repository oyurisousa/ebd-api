import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FetchRegistrationsDto {
  @ApiProperty({
    description: 'Número da página para a listagem',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 10,
    required: false,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  perPage: number = 10;

  @ApiProperty({
    description: 'id do trimester',
    example: '3d0ccdc8-a3c0-4e9a-9680-a87be45f5d7e',
  })
  @Type(() => String)
  @IsString()
  trimesterRoomId: string;

  @ApiProperty({
    example: 'João',
    description: 'Nome da aluno',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
