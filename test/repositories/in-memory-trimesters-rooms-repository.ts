import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TrimestersRoomsRepository } from '@/domain/ebd/application/repositories/trimester-room-repository';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';

export class InMemoryTrimestersRoomsRepository
  implements TrimestersRoomsRepository
{
  public items: TrimesterRoom[] = [];

  async create(trimesterRoom: TrimesterRoom): Promise<void> {
    this.items.push(trimesterRoom);
  }
  async findByTrimesterIdAndRooId(
    trimesterId: string,
    roomId: string,
  ): Promise<TrimesterRoom | null> {
    const trimester = this.items.find(
      (item) =>
        item.roomId.equal(new UniqueEntityId(roomId)) &&
        item.trimesterId.equal(new UniqueEntityId(trimesterId)),
    );

    if (!trimester) {
      return null;
    }

    return trimester;
  }
}
