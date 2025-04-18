import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';
import { PreLesson as PrismaPreLesson, type Prisma } from '@prisma/client';

export class PrismaPreLessonMapper {
  static toDomain(raw: PrismaPreLesson): PreLesson {
    return PreLesson.create(
      {
        date: raw.date,
        lesson: raw.lesson,
        trimesterId: new UniqueEntityId(raw.trimesterId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(prelesson: PreLesson): Prisma.PreLessonUncheckedCreateInput {
    return {
      id: prelesson.id.toString(),
      date: prelesson.date,
      lesson: prelesson.lesson,
      trimesterId: prelesson.trimesterId.toString(),
      createdAt: prelesson.createdAt,
    };
  }
}
