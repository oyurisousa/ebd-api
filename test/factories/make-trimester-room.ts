import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  TrimesterRoom,
  TrimesterRoomProps,
} from '@/domain/ebd/enterprise/trimester-room';
import { PrismaTrimesterRoomMapper } from '@/infra/database/prisma/mappers/prisma-trimester-room-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeTrimesterRoom(
  override: Partial<TrimesterRoomProps> = {},
  id?: UniqueEntityId,
) {
  const trimesterroom = TrimesterRoom.create(
    {
      roomId: new UniqueEntityId(),
      trimesterId: new UniqueEntityId(),
      teachersIds: [],
      ...override,
    },
    id,
  );

  return trimesterroom;
}

@Injectable()
export class TrimesterRoomFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTrimesterRoom(
    data: Partial<TrimesterRoomProps> = {},
  ): Promise<TrimesterRoom> {
    const trimesterRoom = makeTrimesterRoom({
      ...data,
    });

    await this.prisma.trimesterRoom.create({
      data: PrismaTrimesterRoomMapper.toPrisma(trimesterRoom),
    });

    return trimesterRoom;
  }
}
