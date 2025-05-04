import { LessonsRepository } from '@/domain/ebd/application/repositories/lessons-repository';
import { Lesson } from '@/domain/ebd/enterprise/lesson';

export class InMemoryLessonsRepository implements LessonsRepository {
  public items: Lesson[] = [];
}
