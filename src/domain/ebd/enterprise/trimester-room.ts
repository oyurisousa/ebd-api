import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface TrimesterRoomProps {
  trimesterId: UniqueEntityId;
  roomId: UniqueEntityId;
}

export class TrimesterRoom extends Entity<TrimesterRoomProps> {
  get trimesterId() {
    return this.props.trimesterId;
  }

  get roomId() {
    return this.props.roomId;
  }

  static create(props: TrimesterRoomProps, id?: UniqueEntityId) {
    const trimesterRoom = new TrimesterRoom(props, id);

    return trimesterRoom;
  }
}
