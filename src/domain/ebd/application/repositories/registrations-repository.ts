import { PaginationParams } from '@/core/repositories/pagination-params';
import { Registration } from '../../enterprise/registration';
import { Meta } from '@/core/repositories/meta';
import type { RegistrationWithName } from '../../enterprise/value-objects/registration-with-name';

export abstract class RegistrationsRepository {
  abstract create(registration: Registration): Promise<void>;
  abstract findById(id: string): Promise<Registration | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      trimesterRoomId: string;
      name?: string;
    },
  ): Promise<{ registrations: RegistrationWithName[]; meta: Meta }>;
}
