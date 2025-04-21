import { IsUUID, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AllocateTeacherDto {
  @IsUUID()
  trimesterRoomId: string;

  @ApiProperty({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description:
      'Array of IDs for therapeutic classes associated with the medicine.',
    isArray: true,
    type: String,
  })
  @IsArray({ message: 'Therapeutic classes must be an array of IDs.' })
  @IsString({
    each: true,
    message: 'Each therapeutic class ID must be a string.',
  })
  teachersIds: string[];
}
