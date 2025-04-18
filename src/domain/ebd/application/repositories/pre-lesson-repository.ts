import { PreLesson } from '../../enterprise/pre-lesson';

export abstract class PreLessonRepository {
  abstract create(preLesson: PreLesson): Promise<void>;
  abstract findById(id: string): Promise<PreLesson | null>;
  abstract findByTrimesterIdAndNumberLesson(
    trimesterId: string,
    numberLesson: number,
  ): Promise<PreLesson | null>;
}
