import type { Meta } from '@/core/repositories/meta';
import { Member, type Sex } from '../../enterprise/member';
import type { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class MembersRepository {
  abstract create(member: Member): Promise<void>;
  abstract findById(id: string): Promise<Member | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      name?: string;
      sex?: Sex;
      birthDate?: Date;
    },
  ): Promise<{ members: Member[]; meta: Meta }>;
}
