import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AggregateRoot } from '@/core/entities/aggregate-root';

export interface RegistrationProps {
  studentId: UniqueEntityId;
  trimesterRommId: UniqueEntityId;
  createdAt: Date;
}

export class Registration extends AggregateRoot<RegistrationProps> {
  get studentId() {
    return this.props.studentId;
  }

  get trimesterRommId() {
    return this.props.trimesterRommId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<RegistrationProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const registration = new Registration(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return registration;
  }
}
