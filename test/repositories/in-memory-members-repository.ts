import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { MembersRepository } from '@/domain/ebd/application/repositories/members-repository';
import { Member } from '@/domain/ebd/enterprise/member';

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
}
