import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Lesson } from '@/domain/ebd/enterprise/lesson';
import { Lesson as PrismaLesson, type Prisma } from '@prisma/client';

export class PrismaLessonMapper {
  static toDomain(
    raw: PrismaLesson & { studentsAttendanceIds: string[] },
  ): Lesson {
    return Lesson.create(
      {
        bibles: raw.bibles,
        magazines: raw.magazines,
        offers: raw.offers,
        preLessonId: new UniqueEntityId(raw.preLessonId),
        title: raw.title,
        trimesterRoomId: new UniqueEntityId(raw.trimesterRoomId),
        visitors: raw.visitors,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        studentsAttendanceIds: raw.studentsAttendanceIds.map(
          (id) => new UniqueEntityId(id),
        ),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(lesson: Lesson): Prisma.LessonUncheckedCreateInput {
    return {
      id: lesson.id.toString(),
      bibles: lesson.bibles,
      magazines: lesson.magazines,
      offers: lesson.offers,
      preLessonId: lesson.preLessonId.toString(),
      title: lesson.title,
      trimesterRoomId: lesson.trimesterRoomId.toString(),
      visitors: lesson.visitors,
      Attendance: {
        create: lesson.studentsAttendanceIds.map((id) => ({
          registrationId: id.toString(),
          present: false,
        })),
      },
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}
