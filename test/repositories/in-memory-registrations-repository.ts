import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { RegistrationsRepository } from '@/domain/ebd/application/repositories/registrations-repository';
import { Registration } from '@/domain/ebd/enterprise/registration';
import { InMemoryMembersRepository } from './in-memory-members-repository';
import { RegistrationWithName } from '@/domain/ebd/enterprise/value-objects/registration-with-name';

export class InMemoryRegistrationsRepository
  implements RegistrationsRepository
{
  constructor(private membersRepository: InMemoryMembersRepository) {}

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

  async findMany(
    { page = 1, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { trimesterRoomId: string; name?: string },
  ): Promise<{ registrations: RegistrationWithName[]; meta: Meta }> {
    const { trimesterRoomId, name } = filters;

    const filteredRegistrations: (RegistrationWithName | null)[] =
      await Promise.all(
        this.items.map(async (registration) => {
          if (
            !registration.trimesterRommId.equal(
              new UniqueEntityId(trimesterRoomId),
            )
          ) {
            return null;
          }

          const member = await this.membersRepository.findById(
            registration.studentId.toString(),
          );

          if (!member) {
            throw new Error('Membro não encontrado!');
          }

          if (name && !member.name.toLowerCase().includes(name.toLowerCase())) {
            return null;
          }

          return Object.assign({
            ...registration,
            name: member.name,
          });
        }),
      );

    const validRegistrations = filteredRegistrations.filter(
      (item): item is RegistrationWithName => item !== null,
    );

    const sortedRegistrations = [...validRegistrations].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const paginatedRegistrations = sortedRegistrations.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      registrations: paginatedRegistrations,
      meta: {
        page,
        totalPage: paginatedRegistrations.length,
        totalCount: sortedRegistrations.length,
      },
    };
  }
}
