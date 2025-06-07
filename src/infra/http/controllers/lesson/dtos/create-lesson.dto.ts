import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class StudentAttendanceDto {
  @ApiProperty({
    example: '73f607e5-40f1-456c-9a76-9c6218c9306f',
    description: 'ID da matrícula do aluno',
  })
  @IsUUID()
  registrationId: string;

  @ApiProperty({
    example: true,
    description: 'Se o aluno esteve presente',
  })
  @IsBoolean()
  present: boolean;
}

export class CreateLessonDto {
  @ApiProperty({
    example: '54c356d0-bf5c-4f8f-94f2-2e8298b9479e',
    description: 'ID da sala do trimestre',
  })
  @IsUUID()
  trimesterRoomId: string;

  @ApiProperty({
    example: '7a23f3cf-9f89-4b44-93c3-b4f8cfc8d833',
    description: 'ID da pré-aula',
  })
  @IsUUID()
  preLessonId: string;

  @ApiProperty({
    example: 'A Fé que Remove Montanhas',
    description: 'Título da lição',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Lista de presenças dos alunos',
    type: [StudentAttendanceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  studentsAttendance: StudentAttendanceDto[];

  @ApiProperty({
    example: 2,
    description: 'Número de visitantes presentes',
  })
  @IsNumber()
  @Min(0)
  visitors: number;

  @ApiProperty({
    example: 15,
    description: 'Número de Bíblias levadas',
  })
  @IsNumber()
  @Min(0)
  bibles: number;

  @ApiProperty({
    example: 13,
    description: 'Número de revistas levadas',
  })
  @IsNumber()
  @Min(0)
  magazines: number;

  @ApiProperty({
    example: 25.5,
    description: 'Valor total das ofertas (em reais)',
  })
  @IsNumber()
  @Min(0)
  offers: number;
}
