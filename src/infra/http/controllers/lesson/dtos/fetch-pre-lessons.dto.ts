import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FetchPreLessonsDto {
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
    example: 2,
    description: 'Número da lição',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  numberLesson?: number;

  @ApiProperty({
    example: '2025-05-15',
    description: 'Data da lição',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiProperty({
    example: true,
    description: 'apenas lições em andamento',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  inProgress?: boolean;

  @ApiProperty({
    description: 'id do trimester',
    example: '3d0ccdc8-a3c0-4e9a-9680-a87be45f5d7e',
  })
  @Type(() => String)
  @IsString()
  trimesterId: string;
}
