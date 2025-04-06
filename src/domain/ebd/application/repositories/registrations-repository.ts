import { Registration } from '../../enterprise/registration';

export abstract class RegistrationsRepository {
  abstract create(registration: Registration): Promise<void>;
  abstract findById(id: string): Promise<Registration | null>;
}
