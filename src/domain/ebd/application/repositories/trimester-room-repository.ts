import { TrimesterRoom } from '../../enterprise/trimester-room';

export abstract class TrimestersRoomsRepository {
  abstract create(trimesterRoom: TrimesterRoom): Promise<void>;
  abstract findById(id: string): Promise<TrimesterRoom | null>;
  abstract findByTrimesterIdAndRooId(
    trimesterId: string,
    roomId: string,
  ): Promise<TrimesterRoom | null>;
  abstract addTeacher(
    teacherId: string,
    trimesterRoomId: string,
  ): Promise<TrimesterRoom>;
}
