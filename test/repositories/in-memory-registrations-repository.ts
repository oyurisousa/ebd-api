import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { RegistrationsRepository } from '@/domain/ebd/application/repositories/registrations-repository';
import { Registration } from '@/domain/ebd/enterprise/registration';

export class InMemoryRegistrationsRepository
  implements RegistrationsRepository
{
  public items: Registration[] = [];

  async create(registration: Registration): Promise<void> {
    this.items.push(registration);
  }

  async findById(id: string): Promise<Registration | null> {
    const registration = this.items.find((item) =>
      item.id.equal(new UniqueEntityId(id)),
    );
    if (!registration) {
      return null;
    }

    return registration;
  }
}
