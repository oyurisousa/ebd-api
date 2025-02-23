import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Member, Sex, type MemberProps } from '@/domain/ebd/enterprise/member';
import { PrismaMemberMapper } from '@/infra/database/prisma/mappers/prisma-member-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeMember(
  override: Partial<MemberProps> = {},
  id?: UniqueEntityId,
) {
  const member = Member.create(
    {
      birthDate: faker.date.past({ years: 30 }),
      name: faker.person.fullName(),
      sex: faker.helpers.enumValue(Sex),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id,
  );

  return member;
}

@Injectable()
export class MemberFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMember(data: Partial<MemberProps> = {}): Promise<Member> {
    const member = makeMember({
      ...data,
    });

    await this.prisma.member.create({
      data: PrismaMemberMapper.toPrisma(member),
    });

    return member;
  }
}
