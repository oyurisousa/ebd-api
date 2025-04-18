import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PreLessonRepository } from '@/domain/ebd/application/repositories/pre-lesson-repository';
import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';

export class InMemoryPreLessonRepository implements PreLessonRepository {
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
}
