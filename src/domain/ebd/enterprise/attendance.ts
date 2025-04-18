import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface AttendanceProps {
  lessonId: UniqueEntityId;
  registrationId: UniqueEntityId;
  present: boolean;
}

export class Attendance extends Entity<AttendanceProps> {
  get lessonId() {
    return this.props.lessonId;
  }

  get registrationId() {
    return this.props.registrationId;
  }

  get present() {
    return this.props.present;
  }

  static create(props: AttendanceProps, id?: UniqueEntityId) {
    const attendance = new Attendance(
      {
        ...props,
      },
      id,
    );

    return attendance;
  }
}
