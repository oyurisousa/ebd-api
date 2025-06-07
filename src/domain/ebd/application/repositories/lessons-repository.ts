import { Lesson } from '../../enterprise/lesson';

export abstract class LessonsRepository {
  abstract create(lesson: Lesson): Promise<void>;
  abstract save(lesson: Lesson): Promise<void>;
}
