import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePreLessonDto {
  @ApiProperty({
    example: 'abc123',
    description: 'ID do trimestre relacionado à aula.',
  })
  @IsString()
  @IsNotEmpty()
  trimesterId: string;

  @ApiProperty({
    example: '2025-04-18T10:00:00.000Z',
    description: 'Data em que a aula será realizada.',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    example: 3,
    description: 'Número da aula dentro do trimestre.',
  })
  @IsNumber()
  @Type(() => Number)
  numberLesson: number;
}
