import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FetchTrimestersDto {
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

  @ApiPropertyOptional({
    example: 'Trimestre 1 ou 2025.1',
    description: 'Título do trimestre',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número do trimestre (1 a 4)',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  quarter?: number;

  @ApiPropertyOptional({ example: 2025, description: 'Ano do trimestre' })
  @IsOptional()
  @IsNumber()
  year?: number;
}
