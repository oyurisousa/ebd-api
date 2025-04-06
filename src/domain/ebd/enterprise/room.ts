import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { AgeGroup } from './value-objects/age-group';

export interface RoomProps {
  name: string;
  ageGroup: AgeGroup;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Room extends AggregateRoot<RoomProps> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get ageGroup() {
    return this.props.ageGroup;
  }

  set ageGroup(value: AgeGroup) {
    this.props.ageGroup = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<RoomProps, 'createdAt'>, id?: UniqueEntityId) {
    const room = new Room(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return room;
  }
}
