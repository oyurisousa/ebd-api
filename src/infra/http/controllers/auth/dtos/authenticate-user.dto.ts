import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateUserDTO {
  @ApiProperty({
    example: 'john_doe',
    description: 'O nome de usuário do usuário utilizado para autenticação.',
  })
  @IsString({ message: 'O nome de usuário deve ser uma string' })
  @Matches(/^[a-z][a-z0-9._]{2,29}$/, {
    message:
      'O nome de usuário deve ter entre 3 e 30 caracteres, começar com uma letra e conter apenas letras, números, pontos ou underscores.',
  })
  username: string;

  @ApiProperty({
    example: 'senha123',
    description: 'A senha do usuário. Deve ter pelo menos 8 caracteres.',
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password: string;
}

export class AuthenticateResponseDto {
  @ApiProperty({
    description: 'The access token for the authenticated operator.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
