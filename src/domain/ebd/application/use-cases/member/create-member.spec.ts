import { CreateMemberUseCase } from './create-member';
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository';
import { Sex } from '@/domain/ebd/enterprise/member';

let inMemoryMembersRepository: InMemoryMembersRepository;
let sut: CreateMemberUseCase;

describe('Create Member', () => {
  beforeEach(() => {
    inMemoryMembersRepository = new InMemoryMembersRepository();
    sut = new CreateMemberUseCase(inMemoryMembersRepository);
  });

  it('shoult be able to create a new Member', async () => {
    const result = await sut.execute({
      name: 'Antônio Sousa Oliveira',
      birthDate: new Date(1980, 0, 10),
      sex: Sex.MALE,
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryMembersRepository.items).toHaveLength(1);
      expect(inMemoryMembersRepository.items[0]).toEqual(
        expect.objectContaining({
          name: 'Antônio Sousa Oliveira',
          birthDate: expect.any(Date),
          sex: Sex.MALE,
        }),
      );
    }
  });
});
