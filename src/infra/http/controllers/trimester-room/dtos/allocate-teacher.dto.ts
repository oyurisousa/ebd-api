import { IsUUID } from 'class-validator';

export class AllocateTeacherDto {
  @IsUUID()
  trimesterRoomId: string;

  @IsUUID()
  teacherId: string;
}
