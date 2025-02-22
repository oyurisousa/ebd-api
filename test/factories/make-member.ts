import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Member, Sex, type MemberProps } from '@/domain/ebd/enterprise/member';
import { faker } from '@faker-js/faker';

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
