import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Room } from '@/domain/ebd/enterprise/room';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
import { Room as PrismaRoom, type Prisma } from '@prisma/client';

export class PrismaRoomMapper {
  static toDomain(raw: PrismaRoom): Room {
    return Room.create(
      {
        name: raw.name,
        ageGroup: AgeGroup.create(
          raw.minAge ? raw.minAge : undefined,
          raw.maxAge ? raw.maxAge : undefined,
        ),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(room: Room): Prisma.RoomUncheckedCreateInput {
    return {
      id: room.id.toString(),
      name: room.name,
      minAge: room.ageGroup.minAge,
      maxAge: room.ageGroup.maxAge,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
