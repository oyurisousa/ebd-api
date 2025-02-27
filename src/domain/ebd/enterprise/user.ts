import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';

export enum UserRole {
  COMMON = 'COMMON',
  TEACHER = 'TEACHER',
  SHEPHERD = 'SHEPHERD',
  PEDAGOGICAL_DEPARTMENT = 'PEDAGOGICAL_DEPARTMENT',
  SUPERINTENDENT = 'SUPERINTENDENT',
  SECRETARY = 'SECRETARY',
}

export interface UserProps {
  memberId?: UniqueEntityId | null;
  username: Username;
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

  get username() {
    return this.props.username;
  }

  set username(value) {
    this.props.username = value;
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

  public isMember(): boolean {
    return !!this.props.memberId;
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
