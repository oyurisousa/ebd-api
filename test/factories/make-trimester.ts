import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Trimester,
  type TrimesterProps,
} from '@/domain/ebd/enterprise/trimester';
import { PrismaTrimesterMapper } from '@/infra/database/prisma/mappers/prisma-trimester-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

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

@Injectable()
export class TrimesterFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTrimester(
    data: Partial<TrimesterProps> = {},
  ): Promise<Trimester> {
    const trimester = makeTrimester({
      ...data,
    });

    await this.prisma.trimester.create({
      data: PrismaTrimesterMapper.toPrisma(trimester),
    });

    return trimester;
  }
}
