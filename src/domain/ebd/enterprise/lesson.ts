import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface LessonProps {
  trimesterRoomId: UniqueEntityId;
  preLessonId: UniqueEntityId;
  title: string;
  studentsAttendanceIds: UniqueEntityId[];
  visitors: number;
  bibles: number;
  magazines: number;
  offers: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Lesson extends AggregateRoot<LessonProps> {
  get trimesterRoomId() {
    return this.props.trimesterRoomId;
  }

  get preLessonId() {
    return this.props.preLessonId;
  }

  get title() {
    return this.props.title;
  }

  get studentsAttendanceIds() {
    return this.props.studentsAttendanceIds;
  }

  set studentsAttendanceIds(studentsAttendanceIds: UniqueEntityId[]) {
    this.props.studentsAttendanceIds = studentsAttendanceIds;
  }

  get visitors() {
    return this.props.visitors;
  }

  get bibles() {
    return this.props.bibles;
  }
  get magazines() {
    return this.props.magazines;
  }
  get offers() {
    return this.props.offers;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<LessonProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const lesson = new Lesson(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return lesson;
  }
}
