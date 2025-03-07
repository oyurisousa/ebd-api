import { UserRole } from '@/domain/ebd/enterprise/user';
import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({
    example: 'b7ad057c-e80a-4dd0-8eb6-d3f30aad3cec',
    description: 'ID do usuário',
  })
  id: string;

  @ApiProperty({ example: 'test@gmail.com', description: 'E-mail do usuário' })
  email: string;

  @ApiProperty({
    example: 'SHEPHERD',
    description: 'Função do usuário',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({ example: 'test', description: 'Nome de usuário' })
  username: string;

  @ApiProperty({ example: true, description: 'Se o usuário é um membro' })
  isMember: boolean;

  @ApiProperty({
    example: '0ad0847f-cee7-4770-b7f2-1df56972c72c',
    description: 'ID do membro (se for membro)',
    required: false,
  })
  memberId?: string;

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

export class GetUserDetailsResponseDto {
  @ApiProperty({
    description: 'Detalhes do usuário autenticado',
    example: {
      user: {
        id: 'b7ad057c-e80a-4dd0-8eb6-d3f30aad3cec',
        email: 'test@gmail.com',
        role: 'SHEPHERD',
        username: 'test',
        isMember: true,
        memberId: '0ad0847f-cee7-4770-b7f2-1df56972c72c',
        createdAt: '2025-02-23T21:13:18.681Z',
        updatedAt: '2025-03-07T18:24:47.335Z',
      },
    },
  })
  user: UserDto;
}
