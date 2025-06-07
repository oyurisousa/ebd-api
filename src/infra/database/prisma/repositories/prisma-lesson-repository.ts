import { LessonsRepository } from '@/domain/ebd/application/repositories/lessons-repository';
import { Lesson } from '@/domain/ebd/enterprise/lesson';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaLessonMapper } from '../mappers/prisma-lesson-mapper';

@Injectable()
export class PrismaLessonRepository implements LessonsRepository {
  constructor(private prisma: PrismaService) {}

  async create(lesson: Lesson): Promise<void> {
    const data = PrismaLessonMapper.toPrisma(lesson);
    await this.prisma.lesson.create({
      data,
    });
  }

  async save(lesson: Lesson): Promise<void> {
    const data = PrismaLessonMapper.toPrisma(lesson);
    await this.prisma.lesson.update({
      where: { id: lesson.id.toString() },
      data: {
        ...data,
        Attendance: {
          connect: lesson.studentsAttendanceIds.map((id) => ({
            id: id.toString(),
          })),
        },
      },
    });
  }
}
