import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface TrimesterRoomProps {
  trimesterId: UniqueEntityId;
  roomId: UniqueEntityId;
  teachersIds: UniqueEntityId[];
}

export class TrimesterRoom extends Entity<TrimesterRoomProps> {
  get trimesterId() {
    return this.props.trimesterId;
  }

  get roomId() {
    return this.props.roomId;
  }

  get teachersIds() {
    return this.props.teachersIds;
  }

  set teachersIds(ids: UniqueEntityId[]) {
    this.props.teachersIds = ids;
  }

  static create(props: TrimesterRoomProps, id?: UniqueEntityId) {
    const trimesterRoom = new TrimesterRoom(props, id);

    return trimesterRoom;
  }
}
