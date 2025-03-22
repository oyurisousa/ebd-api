import { IsUUID } from 'class-validator';

export class CreateTrimesterRoomDto {
  @IsUUID()
  trimesterId: string;

  @IsUUID()
  roomId: string;
}
