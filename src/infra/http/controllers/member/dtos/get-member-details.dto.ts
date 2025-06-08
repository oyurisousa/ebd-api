import { Sex } from '@/domain/ebd/enterprise/member';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

class MemberDto {
  @ApiProperty({
    example: 'b7ad057c-e80a-4dd0-8eb6-d3f30aad3cec',
    description: 'ID do membro',
  })
  id: string;

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

  @ApiProperty({ example: 30, description: 'Idade do membro' })
  @IsNumber()
  age: number;

  @ApiProperty({
    example: '2025-02-23T21:13:18.681Z',
    description: 'Data de criação',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-03-07T18:24:47.335Z',
    description: 'Data da última atualização',
  })
  updatedAt: string;
}

export class GetMemberDetailsResponseDto {
  @ApiProperty({
    description: 'Detalhes do membro',
    example: {
      member: {
        id: 'b7ad057c-e80a-4dd0-8eb6-d3f30aad3cec',
        name: 'francisco',
        birthDate: '1990-01-01',
        sex: 'MALE',
        age: 30,
        createdAt: '2025-02-23T21:13:18.681Z',
        updatedAt: '2025-03-07T18:24:47.335Z',
      },
    },
  })
  member: MemberDto;
}
