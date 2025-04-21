import { RegistrationProps } from '../registration';
import { Entity } from '@/core/entities/entity';

export interface RegistrationWithNameProps extends RegistrationProps {
  name: string;
}

export class RegistrationWithName extends Entity<RegistrationWithNameProps> {
  get trimesterRoomId() {
    return this.props.trimesterRommId;
  }

  get studentId() {
    return this.props.studentId;
  }

  get name() {
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: RegistrationWithNameProps) {
    return new RegistrationWithName(props);
  }
}
