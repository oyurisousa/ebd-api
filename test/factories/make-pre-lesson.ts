import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  PreLesson,
  type PreLessonProps,
} from '@/domain/ebd/enterprise/pre-lesson';
import { PrismaPreLessonMapper } from '@/infra/database/prisma/mappers/prisma-pre-lesson-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makePreLesson(
  override: Partial<PreLessonProps> = {},
  id?: UniqueEntityId,
) {
  const prelesson = PreLesson.create(
    {
      date: new Date(),
      trimesterId: new UniqueEntityId(),
      lesson: faker.number.int({ min: 1, max: 13 }),
      ...override,
    },
    id,
  );

  return prelesson;
}

@Injectable()
export class PreLessonFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPreLesson(
    data: Partial<PreLessonProps> = {},
  ): Promise<PreLesson> {
    const prelesson = makePreLesson({
      ...data,
    });

    await this.prisma.preLesson.create({
      data: PrismaPreLessonMapper.toPrisma(prelesson),
    });

    return prelesson;
  }
}
