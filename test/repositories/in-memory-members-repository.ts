import { MembersRepository } from '@/domain/ebd/application/repositories/members-repository';
import { Member } from '@/domain/ebd/enterprise/member';

export class InMemoryMembersRepository implements MembersRepository {
  public items: Member[] = [];
  async create(member: Member): Promise<void> {
    this.items.push(member);
  }
}
