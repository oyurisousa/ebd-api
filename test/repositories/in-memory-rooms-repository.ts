import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { RoomsRepository } from '@/domain/ebd/application/repositories/rooms-repository';
import { Room } from '@/domain/ebd/enterprise/room';

export class InMemoryRoomsRepository implements RoomsRepository {
  public items: Room[] = [];

  async create(Room: Room): Promise<void> {
    this.items.push(Room);
  }

  async findById(id: string): Promise<Room | null> {
    const rom = this.items.find((item) => {
      return item.id.equal(new UniqueEntityId(id));
    });

    if (!rom) return null;

    return rom;
  }

  async findByName(name: string): Promise<Room | null> {
    const room = this.items.find((item) =>
      item.name.toLowerCase().includes(name.toLowerCase()),
    );

    if (!room) {
      return null;
    }

    return room;
  }
}
