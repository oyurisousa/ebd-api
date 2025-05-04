import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { UsersRepository } from '@/domain/ebd/application/repositories/users-repository';
import { User, type UserRole } from '@/domain/ebd/enterprise/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) =>
      user.id.equal(new UniqueEntityId(id)),
    );

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      return null;
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.items.find(
      (user) => user.username.value.toLowerCase() === username.toLowerCase(),
    );

    if (!user) {
      return null;
    }

    return user;
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { content?: string; role?: UserRole },
  ): Promise<{ users: User[]; meta: Meta }> {
    const { content, role } = filters;

    const usersFiltered = this.items.filter((user) => {
      if (
        content &&
        !(
          user.email.toLowerCase().includes(content.toLowerCase()) ||
          user.username.value.toLowerCase().includes(content.toLowerCase())
        )
      ) {
        return false;
      }

      if (role && !(user.role === role)) {
        return false;
      }
      return user;
    });
    const usersPaginated = usersFiltered
      .sort((a, b) => a.username.value.localeCompare(b.username.value))
      .slice((page - 1) * perPage, page * perPage);

    return {
      users: usersPaginated,
      meta: {
        page,
        totalCount: usersFiltered.length,
        totalPage: 0,
      },
    };
  }
}
