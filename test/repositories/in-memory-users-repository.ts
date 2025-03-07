import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UsersRepository } from '@/domain/ebd/application/repositories/users-repository';
import { User } from '@/domain/ebd/enterprise/user';

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
}
