import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Room, RoomProps } from '@/domain/ebd/enterprise/room';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
import { PrismaRoomMapper } from '@/infra/database/prisma/mappers/prisma-room-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeRoom(
  override: Partial<RoomProps> = {},
  id?: UniqueEntityId,
) {
  const room = Room.create(
    {
      name: faker.commerce.department(),
      ageGroup: AgeGroup.create(Number(faker.string.numeric({ length: 1 }))),
      ...override,
    },
    id,
  );

  return room;
}

@Injectable()
export class RoomFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRoom(data: Partial<RoomProps> = {}): Promise<Room> {
    const room = makeRoom({
      ...data,
    });

    await this.prisma.room.create({
      data: PrismaRoomMapper.toPrisma(room),
    });

    return room;
  }
}
