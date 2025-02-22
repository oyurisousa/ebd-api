import { Member } from '../../enterprise/member';

export abstract class MembersRepository {
  abstract create(member: Member): Promise<void>;
}
