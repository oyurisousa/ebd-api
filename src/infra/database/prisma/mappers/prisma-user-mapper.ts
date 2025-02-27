import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User, UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { $Enums, User as PrismaUser, type Prisma } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        passwordHash: raw.passwordHash,
        username: Username.create(raw.username),
        memberId: raw.memberId ? new UniqueEntityId(raw.memberId) : null,
        role: UserRole[raw.role],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      email: user.email,
      passwordHash: user.passwordHash,
      username: user.username.value,
      memberId: user.memberId?.toString(),
      role: $Enums.UserRole[user.role],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      id: user.id.toString(),
    };
  }
}
