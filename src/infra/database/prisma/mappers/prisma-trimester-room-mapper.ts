import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';
import {
  TrimesterRoom as PrismaTrimesterRoom,
  type Prisma,
} from '@prisma/client';

export class PrismaTrimesterRoomMapper {
  static toDomain(
    raw: PrismaTrimesterRoom & { teachers?: { id: string }[] },
  ): TrimesterRoom {
    return TrimesterRoom.create(
      {
        roomId: new UniqueEntityId(raw.roomId),
        trimesterId: new UniqueEntityId(raw.trimesterId),
        teachersIds: raw.teachers
          ? raw.teachers.map((teacher) => new UniqueEntityId(teacher.id))
          : [],
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
      teachers: {
        connect: trimester.teachersIds.map((teacherId) => ({
          id: teacherId.toString(),
        })),
      },
    };
  }
}
