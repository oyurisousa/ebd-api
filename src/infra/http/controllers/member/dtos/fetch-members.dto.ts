import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sex } from '@/domain/ebd/enterprise/member';
import { Type } from 'class-transformer';

export class FetchMembersDto {
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
    example: 'João Silva',
    description: 'Nome do membro',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Data de nascimento do membro (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @ApiProperty({
    example: 'MALE',
    description: 'Sexo do membro',
    required: false,
    enum: Sex,
  })
  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;
}
