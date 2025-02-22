import { UserRole } from '@/domain/ebd/enterprise/user';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'joaosilva', description: 'Nome de usuário' })
  @IsString()
  username: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do membro associado',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @ApiProperty({
    example: 'TEACHER',
    description: 'Função do usuário',
    required: false,
    enum: [
      'COMMON',
      'TEACHER',
      'SHEPHERD',
      'PEDAGOGICAL_DEPARTMENT',
      'SUPERINTENDENT',
      'SECRETARY',
    ],
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
