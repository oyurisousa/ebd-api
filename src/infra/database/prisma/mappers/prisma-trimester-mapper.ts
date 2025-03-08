import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Trimester } from '@/domain/ebd/enterprise/trimester';
import { Trimester as PrismaTrimester, type Prisma } from '@prisma/client';

export class PrismaTrimesterMapper {
  static toDomain(raw: PrismaTrimester): Trimester {
    return Trimester.create(
      {
        title: raw.title,
        year: raw.year,
        quarter: raw.quarter,
        startDate: raw.startDate,
        endDate: raw.endDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(trimester: Trimester): Prisma.TrimesterUncheckedCreateInput {
    return {
      id: trimester.id.toString(),
      title: trimester.title,
      year: trimester.year,
      quarter: trimester.quarter,
      startDate: trimester.startDate,
      endDate: trimester.endDate,
      createdAt: trimester.createdAt,
      updatedAt: trimester.updatedAt,
    };
  }
}
