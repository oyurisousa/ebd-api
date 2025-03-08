import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Trimester,
  type TrimesterProps,
} from '@/domain/ebd/enterprise/trimester';
import { faker } from '@faker-js/faker';

export function makeTrimester(
  override: Partial<TrimesterProps> = {},
  id?: UniqueEntityId,
) {
  const trimester = Trimester.create(
    {
      title: faker.lorem.words(3),
      year: faker.date.recent().getFullYear(),
      quarter: faker.helpers.arrayElement([1, 2, 3, 4]),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id,
  );

  return trimester;
}
