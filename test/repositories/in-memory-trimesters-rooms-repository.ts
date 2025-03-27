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

  async findById(id: string): Promise<TrimesterRoom | null> {
    const trimesterRoom = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    );

    if (!trimesterRoom) {
      return null;
    }

    return trimesterRoom;
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

  async addTeacher(
    teacherId: string,
    trimesterRoomId: string,
  ): Promise<TrimesterRoom> {
    const trimesterRoom = await this.findById(trimesterRoomId);
    if (!trimesterRoom) {
      throw new Error(`Trimester room with id "${trimesterRoomId} not found"`);
    }

    trimesterRoom.teachersIds = [
      ...trimesterRoom.teachersIds,
      new UniqueEntityId(teacherId),
    ];

    const trimesterRoomIndex = this.items.findIndex((item) =>
      item.id.equal(new UniqueEntityId(trimesterRoomId)),
    );

    this.items[trimesterRoomIndex] = trimesterRoom;

    return trimesterRoom;
  }
}
