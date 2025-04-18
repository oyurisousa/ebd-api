import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@prisma/client/runtime/library';

export interface PreLessonProps {
  trimesterId: UniqueEntityId;
  date: Date;
  lesson: number;
  createdAt: Date;
}

export class PreLesson extends Entity<PreLessonProps> {
  get trimesterId() {
    return this.props.trimesterId;
  }

  get date() {
    return this.props.date;
  }

  get lesson() {
    return this.props.lesson;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<PreLessonProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const preLesson = new PreLesson(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return preLesson;
  }
}
