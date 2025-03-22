import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';
import {
  TrimesterRoom as PrismaTrimesterRoom,
  type Prisma,
} from '@prisma/client';

export class PrismaTrimesterRoomMapper {
  static toDomain(raw: PrismaTrimesterRoom): TrimesterRoom {
    return TrimesterRoom.create(
      {
        roomId: new UniqueEntityId(raw.roomId),
        trimesterId: new UniqueEntityId(raw.trimesterId),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(
    trimester: TrimesterRoom,
  ): Prisma.TrimesterRoomUncheckedCreateInput {
    return {
      id: trimester.id.toString(),
      roomId: trimester.roomId.toString(),
      trimesterId: trimester.trimesterId.toString(),
    };
  }
}
