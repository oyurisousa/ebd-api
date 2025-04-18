import { PreLessonRepository } from '@/domain/ebd/application/repositories/pre-lesson-repository';
import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaPreLessonMapper } from '../mappers/prisma-pre-lesson-mapper';

@Injectable()
export class PrismaPreLessonRepository implements PreLessonRepository {
  constructor(private prisma: PrismaService) {}

  async create(preLesson: PreLesson): Promise<void> {
    const data = PrismaPreLessonMapper.toPrisma(preLesson);
    await this.prisma.preLesson.create({ data });
  }
  async findById(id: string): Promise<PreLesson | null> {
    const preLesson = await this.prisma.preLesson.findUnique({
      where: {
        id: id,
      },
    });
    if (!preLesson) {
      return null;
    }

    return PrismaPreLessonMapper.toDomain(preLesson);
  }
  async findByTrimesterIdAndNumberLesson(
    trimesterId: string,
    numberLesson: number,
  ): Promise<PreLesson | null> {
    const preLesson = await this.prisma.preLesson.findFirst({
      where: {
        trimesterId: { equals: trimesterId },
        lesson: numberLesson,
      },
    });

    if (!preLesson) {
      return null;
    }
    return PrismaPreLessonMapper.toDomain(preLesson);
  }
}
