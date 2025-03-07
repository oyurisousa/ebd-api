import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { MembersRepository } from '@/domain/ebd/application/repositories/members-repository';
import { Member, type Sex } from '@/domain/ebd/enterprise/member';

export class InMemoryMembersRepository implements MembersRepository {
  public items: Member[] = [];
  async create(member: Member): Promise<void> {
    this.items.push(member);
  }

  async findById(id: string): Promise<Member | null> {
    const member = this.items.find((member) => {
      return member.id.equal(new UniqueEntityId(id));
    });

    if (!member) return null;

    return member;
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { name?: string; sex?: Sex; birthDate?: Date },
  ): Promise<{ members: Member[]; meta: Meta }> {
    const { name, birthDate, sex } = filters;

    const membersFiltered = this.items
      .filter((member) => {
        if (name && !member.name.toLowerCase().includes(name.toLowerCase())) {
          return false;
        }

        if (
          birthDate &&
          !(member.birthDate.getTime() === birthDate.getTime())
        ) {
          return false;
        }

        if (sex && !(member.sex.toString() === sex.toString())) {
          return false;
        }

        return member;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const membersPaginated = membersFiltered.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      members: membersPaginated,
      meta: {
        page,
        totalCount: membersFiltered.length,
        totalPage: membersPaginated.length,
      },
    };
  }
}
