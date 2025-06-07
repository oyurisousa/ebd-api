import { LessonsRepository } from '@/domain/ebd/application/repositories/lessons-repository';
import { Lesson } from '@/domain/ebd/enterprise/lesson';

export class InMemoryLessonsRepository implements LessonsRepository {
  public items: Lesson[] = [];

  async create(lesson: Lesson): Promise<void> {
    this.items.push(lesson);
  }

  async save(lesson: Lesson): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equal(lesson.id));
    this.items[itemIndex] = lesson;
  }
}
