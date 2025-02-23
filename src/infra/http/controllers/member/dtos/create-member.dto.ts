import { IsDate, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sex } from '@/domain/ebd/enterprise/member';
import { Type } from 'class-transformer';

export class CreateMemberDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome do membro' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Data de nascimento do membro (YYYY-MM-DD)',
  })
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({ example: 'MALE', description: 'Sexo do membro', enum: Sex })
  @IsEnum(Sex)
  sex: Sex;
}
