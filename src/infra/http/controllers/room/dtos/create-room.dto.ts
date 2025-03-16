import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Jovens', description: 'Nome da sala' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 18,
    description: 'Idade mínima para a sala',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAge?: number;

  @ApiProperty({
    example: 25,
    description: 'Idade máxima para a sala',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAge?: number;
}
