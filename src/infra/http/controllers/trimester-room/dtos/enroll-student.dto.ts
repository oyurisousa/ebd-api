import { IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentDto {
  @ApiProperty({
    example: 'f4b52ef9-91e4-4bb8-b2a3-89c2c179d3b3',
    description: 'ID da sala do trimestre',
  })
  @IsUUID()
  trimesterRoomId: string;

  @ApiProperty({
    example: [
      'c1f3e6ab-92b4-46b1-88fa-1a5d6e5c82f2',
      'a3d9e8bf-27e2-4a9d-a9a2-74d19d6f8b2b',
    ],
    description: 'Lista de IDs dos alunos',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  studentsIds: string[];
}
