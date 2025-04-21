import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class CreateTrimesterRoomDto {
  @IsUUID()
  trimesterId: string;

  @ApiProperty({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'lista de ids das turmas',
    isArray: true,
    type: String,
  })
  @IsArray({ message: 'rooms must be an array of IDs.' })
  @IsString({
    each: true,
    message: 'Each room id must be a string.',
  })
  roomsIds: string[];
}
