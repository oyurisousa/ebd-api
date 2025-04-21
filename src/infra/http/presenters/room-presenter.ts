import { Room } from '@/domain/ebd/enterprise/room';

export class RoomPresenter {
  static toHTTP(room: Room) {
    return {
      id: room.id.toString(),
      name: room.name,
      minAge: room.ageGroup.minAge ?? null,
      maxAge: room.ageGroup.maxAge ?? null,
      isUnrestricted: room.ageGroup.unrestricted,
    };
  }
}
