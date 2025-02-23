import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AggregateRoot } from '@/core/entities/aggregate-root';

export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface MemberProps {
  name: string;
  birthDate: Date;
  sex: Sex;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Member extends AggregateRoot<MemberProps> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get birthDate() {
    return this.props.birthDate;
  }

  set birthDate(value: Date) {
    this.props.birthDate = value;
    this.touch();
  }

  get sex() {
    return this.props.sex;
  }

  set sex(value: Sex) {
    this.props.sex = value;
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

  calculateAge(): number {
    const today = new Date();
    const age = today.getFullYear() - this.birthDate.getFullYear();
    const monthDifference = today.getMonth() - this.birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < this.birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  }

  static create(
    props: Optional<MemberProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const member = new Member(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return member;
  }
}
