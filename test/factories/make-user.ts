import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User, UserRole, type UserProps } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      username: Username.create(
        `${faker.lorem.word({ length: 2 })}_${randomInt(0, 100).toString()}_${faker.lorem.word({ length: 4 })}`,
      ),
      memberId: undefined,
      passwordHash: faker.internet.password(),
      role: faker.helpers.enumValue(UserRole),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser({
      ...data,
    });

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
