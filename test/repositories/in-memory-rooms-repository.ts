import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
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

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { name?: string },
  ): Promise<{ rooms: Room[]; meta: Meta }> {
    const { name } = filters;
    const roomsFiltered = this.items
      .filter((room) => {
        return room.name.toLowerCase().includes(name?.toLowerCase() ?? '');
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const roomsPagination = roomsFiltered.splice(
      (page - 1) * perPage,
      perPage * page,
    );

    return {
      rooms: roomsPagination,
      meta: {
        page,
        totalCount: roomsFiltered.length,
        totalPage: roomsPagination.length,
      },
    };
  }
}
