import type { Meta } from '@/core/repositories/meta';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import { User, type UserRole } from '@/domain/ebd/enterprise/user';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      content?: string;
      role?: UserRole;
    },
  ): Promise<{ users: User[]; meta: Meta }>;
}
