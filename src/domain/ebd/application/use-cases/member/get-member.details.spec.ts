import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository';
import { GetMemberDetailsUseCase } from './get-member-details';
import { makeMember } from 'test/factories/make-member';

let inMemoryMembersRepository: InMemoryMembersRepository;
let sut: GetMemberDetailsUseCase;
describe('Get Member Details', () => {
  beforeEach(() => {
    inMemoryMembersRepository = new InMemoryMembersRepository();

    sut = new GetMemberDetailsUseCase(inMemoryMembersRepository);
  });

  it('should be able to get Member details', async () => {
    const member = makeMember({
      name: 'John Doe',
    });
    await inMemoryMembersRepository.create(member);

    const result = await sut.execute({ memberId: member.id.toString() });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.member.id).toBe(member.id);
    }
  });
});
