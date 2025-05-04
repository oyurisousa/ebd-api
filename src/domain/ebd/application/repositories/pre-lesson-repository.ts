import { PaginationParams } from '@/core/repositories/pagination-params';
import { PreLesson } from '../../enterprise/pre-lesson';
import { Meta } from '@/core/repositories/meta';

export abstract class PreLessonRepository {
  abstract create(preLesson: PreLesson): Promise<void>;
  abstract findById(id: string): Promise<PreLesson | null>;
  abstract findByTrimesterIdAndNumberLesson(
    trimesterId: string,
    numberLesson: number,
  ): Promise<PreLesson | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      trimesterId: string;
      numberLesson?: number;
      date?: Date;
    },
  ): Promise<{
    preLessons: Array<PreLesson & { pendingClasses: number }>;
    meta: Meta;
  }>;
}
