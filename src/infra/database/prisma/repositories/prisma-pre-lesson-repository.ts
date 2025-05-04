import { PreLessonRepository } from '@/domain/ebd/application/repositories/pre-lesson-repository';
import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaPreLessonMapper } from '../mappers/prisma-pre-lesson-mapper';
import { Meta } from '@/core/repositories/meta';
import {
  PaginationParams,
  PER_PAGE_DEFAULT,
} from '@/core/repositories/pagination-params';
import { Prisma } from '@prisma/client';
import { Lesson } from '@/domain/ebd/enterprise/lesson';

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

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { trimesterId: string; numberLesson?: number; date?: Date },
  ): Promise<{
    preLessons: Array<PreLesson & { pendingClasses: number }>;
    meta: Meta;
  }> {
    const { trimesterId, date, numberLesson } = filters;

    const whereClause: Prisma.PreLessonWhereInput = {
      trimesterId: {
        equals: trimesterId,
      },
      ...(Lesson && {
        lesson: {
          equals: numberLesson,
        },
      }),
      ...(date && {
        date: {
          gte: date,
          lte: date,
        },
      }),
    };

    const [preLessons, totalCount] = await this.prisma.$transaction([
      this.prisma.preLesson.findMany({
        where: whereClause,
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: {
          lesson: 'asc',
        },
      }),
      this.prisma.preLesson.count({
        where: whereClause,
      }),
    ]);

    const preLessonsMapped = await Promise.all(
      preLessons.map(async (preLesson) => {
        const [
          lessonsRegisteredByNumberLessonTotalCount,
          trimesterRoomsByTrimesterIdTotalCount,
        ] = await this.prisma.$transaction([
          this.prisma.lesson.count({
            where: {
              preLesson: {
                trimesterId: {
                  equals: trimesterId,
                },
                lesson: {
                  equals: preLesson.lesson,
                },
              },
            },
          }),
          this.prisma.trimesterRoom.count({
            where: {
              trimesterId: { equals: trimesterId },
            },
          }),
        ]);

        const domainPreLesson = PrismaPreLessonMapper.toDomain(preLesson);

        const withPending = domainPreLesson as PreLesson & {
          pendingClasses: number;
        };
        withPending.pendingClasses =
          trimesterRoomsByTrimesterIdTotalCount -
          lessonsRegisteredByNumberLessonTotalCount;

        return withPending;
      }),
    );

    return {
      preLessons: preLessonsMapped,
      meta: {
        page,
        totalCount: totalCount,
        totalPage: preLessons.length,
      },
    };
  }
}
