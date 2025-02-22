import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AggregateRoot } from '@/core/entities/aggregate-root';

export enum sex {
  MALE = 'M',
  FEMALE = 'F',
}

export interface MemberProps {
  name: string;
  cpf: string;
  birthDate: Date;
  sex: sex;
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

  get cpf() {
    return this.props.cpf;
  }

  set cpf(value: string) {
    this.props.cpf = value;
    this.touch();
  }

  public getFormattedCpf(): string {
    return this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
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

  set sex(value: sex) {
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
