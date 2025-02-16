import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';

export enum UserRole {
  COMMON = 'COMMON',
  TEACHER = 'TEACHER',
  PASTOR = 'PASTOR',
  PEDAGOGICAL_DEPARTMENT = 'PEDAGOGICAL_DEPARTMENT',
  SUPERINTENDENT = 'SUPERINTENDENT',
  SECRETARY = 'SECRETARY',
}

export interface UserProps {
  memberId: UniqueEntityId;
  user: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  get memberId() {
    return this.props.memberId;
  }

  get user() {
    return this.props.user;
  }

  set user(value) {
    this.props.user = value;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(value) {
    this.props.email = value;
    this.touch();
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  set passwordHash(value) {
    this.props.passwordHash = value;
    this.touch();
  }

  get role() {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;
  }

  public assignRole(value: UserRole) {
    this.props.role = value;
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

  static create(
    props: Optional<UserProps, 'createdAt' | 'role'>,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: props.role ?? UserRole.COMMON,
      },
      id,
    );

    return user;
  }
}
