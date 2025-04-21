import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { TrimestersRoomsRepository } from '@/domain/ebd/application/repositories/trimester-room-repository';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';
import { InMemoryRoomsRepository } from './in-memory-rooms-repository';
import { TrimesterRoomWithRoom } from '@/domain/ebd/enterprise/value-objects/trimester-room-with-room';

export class InMemoryTrimestersRoomsRepository
  implements TrimestersRoomsRepository
{
  constructor(private roomsRepository: InMemoryRoomsRepository) {}
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

  async addTeachers(
    teachersIds: string[],
    trimesterRoomId: string,
  ): Promise<TrimesterRoom> {
    const trimesterRoom = await this.findById(trimesterRoomId);
    if (!trimesterRoom) {
      throw new Error(`Trimester room with id "${trimesterRoomId}" not found`);
    }

    const newTeacherIds = teachersIds.map((id) => new UniqueEntityId(id));

    trimesterRoom.teachersIds = [
      ...trimesterRoom.teachersIds,
      ...newTeacherIds,
    ];

    const index = this.items.findIndex((item) =>
      item.id.equal(new UniqueEntityId(trimesterRoomId)),
    );

    this.items[index] = trimesterRoom;

    return trimesterRoom;
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    trimesterId: string,
  ): Promise<{
    trimestersRooms: TrimesterRoomWithRoom[];
    meta: Meta;
  }> {
    const filteredRooms = this.items.filter((item) =>
      item.trimesterId.equal(new UniqueEntityId(trimesterId)),
    );

    const trimestersRoomsFiltered = await Promise.all(
      filteredRooms.map(async (item) => {
        const room = await this.roomsRepository.findById(
          item.roomId.toString(),
        );
        if (!room) {
          throw new Error('Sala não encontrada!');
        }
        return Object.assign(item, { name: room.name });
      }),
    );

    const trimestersRoomsMapped = trimestersRoomsFiltered
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * perPage, page * perPage)
      .map((item) => {
        return TrimesterRoomWithRoom.create({
          trimesterRoomId: item.id,
          name: item.name,
          roomId: item.roomId,
          trimesterId: item.trimesterId,
          teachersIds: item.teachersIds,
          registrationsIds: item.registrationsIds,
        });
      });

    return {
      trimestersRooms: trimestersRoomsMapped,
      meta: {
        page,
        totalCount: trimestersRoomsFiltered.length,
        totalPage: Math.ceil(trimestersRoomsFiltered.length / perPage),
      },
    };
  }
}
