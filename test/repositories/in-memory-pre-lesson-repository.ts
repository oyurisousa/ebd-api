import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { PreLessonRepository } from '@/domain/ebd/application/repositories/pre-lesson-repository';
import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';
import { InMemoryTrimestersRoomsRepository } from './in-memory-trimesters-rooms-repository';
import { InMemoryLessonsRepository } from './in-memory-lessons-repository';

export class InMemoryPreLessonRepository implements PreLessonRepository {
  constructor(
    private trimestersRoomsRepository: InMemoryTrimestersRoomsRepository,
    private lessonsRepository: InMemoryLessonsRepository,
  ) {}
  public items: PreLesson[] = [];

  async create(preLesson: PreLesson): Promise<void> {
    this.items.push(preLesson);
  }
  async findById(id: string): Promise<PreLesson | null> {
    const preLesson = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    );

    if (!preLesson) {
      return null;
    }

    return preLesson;
  }

  async findByTrimesterIdAndNumberLesson(
    trimesterId: string,
    numberLesson: number,
  ): Promise<PreLesson | null> {
    const preLesson = this.items.find(
      (item) =>
        item.trimesterId.equal(new UniqueEntityId(trimesterId)) &&
        item.lesson == numberLesson,
    );

    if (!preLesson) {
      return null;
    }

    return preLesson;
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: {
      trimesterId: string;
      numberLesson?: number;
      date?: Date;
      inProgress?: boolean;
    },
  ): Promise<{
    preLessons: Array<PreLesson & { pendingClasses: number }>;
    meta: Meta;
  }> {
    const { trimesterId, date, numberLesson, inProgress } = filters;
    const preLessonsFiltered = this.items.filter((preLesson) => {
      if (!preLesson.trimesterId.equal(new UniqueEntityId(trimesterId))) {
        return false;
      }

      if (numberLesson && preLesson.lesson !== numberLesson) {
        return false;
      }

      if (
        date &&
        !(
          preLesson.date.getDate() === date.getDate() &&
          preLesson.date.getMonth() === date.getMonth() &&
          preLesson.date.getFullYear() === date.getFullYear()
        )
      ) {
        return false;
      }

      const trimesterRooms = this.trimestersRoomsRepository.items.filter(
        (trimesterRoom) => {
          return trimesterRoom.trimesterId.equal(
            new UniqueEntityId(trimesterId),
          );
        },
      );

      const lessons = this.lessonsRepository.items.filter((lesson) => {
        lesson.preLessonId.equal(preLesson.id);
      });

      if (inProgress && !(trimesterRooms.length - lessons.length > 0)) {
        return false;
      }

      return preLesson;
    });

    const preLessonsPagineted = preLessonsFiltered
      .sort((a, b) => a.lesson - b.lesson)
      .slice((page - 1) * perPage, page * perPage);

    const preLessonsMapped = preLessonsPagineted.map((preLesson) => {
      const trimesterRooms = this.trimestersRoomsRepository.items.filter(
        (trimesterRoom) =>
          trimesterRoom.trimesterId.equal(new UniqueEntityId(trimesterId)),
      );

      const lessons = this.lessonsRepository.items.filter((lesson) => {
        lesson.preLessonId.equal(preLesson.id);
      });

      const pendingClasses = trimesterRooms.length - lessons.length;

      return Object.assign({
        ...preLesson,
        pendingClasses: pendingClasses,
      });
    });

    return {
      preLessons: preLessonsMapped,
      meta: {
        page,
        totalCount: 0,
        totalPage: 0,
      },
    };
  }
}
