import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface TrimesterRoomWithRoomProps {
  trimesterRoomId: UniqueEntityId;
  trimesterId: UniqueEntityId;
  roomId: UniqueEntityId;
  teachersIds: UniqueEntityId[];
  registrationsIds: UniqueEntityId[];
  name: string;
}

export class TrimesterRoomWithRoom extends ValueObject<TrimesterRoomWithRoomProps> {
  get trimesterRoomId() {
    return this.props.trimesterRoomId;
  }

  get trimesterId() {
    return this.props.trimesterId;
  }

  get roomId() {
    return this.props.roomId;
  }

  get teachersIds() {
    return this.props.teachersIds;
  }

  get registrationsIds() {
    return this.props.registrationsIds;
  }

  get name() {
    return this.props.name;
  }

  static create(props: TrimesterRoomWithRoomProps) {
    return new TrimesterRoomWithRoom(props);
  }
}
