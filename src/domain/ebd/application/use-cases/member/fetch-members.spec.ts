import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository';
import { FetchMembersUseCase } from '../member/fetch-members';
import { makeMember } from 'test/factories/make-member';
import { Sex } from '@/domain/ebd/enterprise/member';

let inMemoryMembersRepository: InMemoryMembersRepository;
let sut: FetchMembersUseCase;
describe('Fetch manufatureres', () => {
  beforeEach(() => {
    inMemoryMembersRepository = new InMemoryMembersRepository();

    sut = new FetchMembersUseCase(inMemoryMembersRepository);
  });

  it('should be able to fetch members', async () => {
    await inMemoryMembersRepository.create(
      makeMember({ createdAt: new Date(2024, 0, 29) }),
    );
    await inMemoryMembersRepository.create(
      makeMember({ createdAt: new Date(2024, 0, 20) }),
    );
    await inMemoryMembersRepository.create(
      makeMember({ createdAt: new Date(2024, 0, 27) }),
    );

    const result = await sut.execute({
      page: 1,
    });
    expect(result.value?.members).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ]);
  });

  it('should be able to fetch paginated members', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryMembersRepository.create(
        makeMember({
          name: `member ${i}`,
          birthDate: new Date(2024, 0, i),
          sex: i % 2 === 0 ? Sex.MALE : Sex.FEMALE,
        }),
      );
    }

    const result = await sut.execute({
      page: 3,
    });
    const result2 = await sut.execute({
      page: 1,
      name: 'member 9',
      birthDate: new Date(2024, 0, 9),
      sex: Sex.FEMALE,
    });

    expect(result.value?.members).toHaveLength(2);
    expect(result2.value?.members).toHaveLength(1);
  });
});
