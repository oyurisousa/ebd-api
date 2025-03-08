import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsIn } from 'class-validator';

export class CreateTrimesterDto {
  @ApiProperty({ example: '1º Trimestre', description: 'Título do trimestre' })
  @IsString()
  title: string;

  @ApiProperty({ example: 2025, description: 'Ano do trimestre' })
  @IsNumber()
  year: number;

  @ApiProperty({
    example: 1,
    description: 'Número do trimestre (1, 2, 3 ou 4)',
  })
  @IsNumber()
  @IsIn([1, 2, 3, 4], { message: 'O trimestre deve ser um valor entre 1 e 4.' })
  quarter: number;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Data de início do trimestre',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    example: '2025-03-31',
    description: 'Data de término do trimestre',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
