import { TrimesterRoomWithRoom } from '@/domain/ebd/enterprise/value-objects/trimester-room-with-room';

export class TrimesterRoomPresenter {
  static toHTTP(trimesterRoom: TrimesterRoomWithRoom) {
    return {
      id: trimesterRoom.trimesterRoomId.toString(),
      name: trimesterRoom.name,
      roomId: trimesterRoom.roomId.toString(),
      trimesterId: trimesterRoom.trimesterId.toString(),
      registrations: trimesterRoom.registrationsIds.length,
      teachers: trimesterRoom.teachersIds.length,
    };
  }
}
