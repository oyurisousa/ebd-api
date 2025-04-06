import { PaginationParams } from '@/core/repositories/pagination-params';
import { Room } from '../../enterprise/room';
import { Meta } from '@/core/repositories/meta';

export abstract class RoomsRepository {
  abstract create(Room: Room): Promise<void>;
  abstract findById(id: string): Promise<Room | null>;
  abstract findByName(name: string): Promise<Room | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      name?: string;
    },
  ): Promise<{ rooms: Room[]; meta: Meta }>;
}
