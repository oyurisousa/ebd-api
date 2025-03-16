import type { Room } from '../../enterprise/room';

export abstract class RoomsRepository {
  abstract create(Room: Room): Promise<void>;
  abstract findById(id: string): Promise<Room | null>;
  abstract findByName(name: string): Promise<Room | null>;
}
