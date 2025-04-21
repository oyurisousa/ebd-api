import { PaginationParams } from '@/core/repositories/pagination-params';
import { TrimesterRoom } from '../../enterprise/trimester-room';
import { Meta } from '@/core/repositories/meta';
import { TrimesterRoomWithRoom } from '../../enterprise/value-objects/trimester-room-with-room';

export abstract class TrimestersRoomsRepository {
  abstract createMany(trimestersRooms: TrimesterRoom[]): Promise<void>;
  abstract findById(id: string): Promise<TrimesterRoom | null>;
  abstract findByTrimesterIdAndRooId(
    trimesterId: string,
    roomId: string,
  ): Promise<TrimesterRoom | null>;
  abstract addTeachers(
    teachersId: string[],
    trimesterRoomId: string,
  ): Promise<TrimesterRoom>;
  abstract findMany(
    params: PaginationParams,
    trimesterId: string,
  ): Promise<{
    trimestersRooms: TrimesterRoomWithRoom[];
    meta: Meta;
  }>;
}
