import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { FetchUsersUseCase } from './fetch-users';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchUsersUseCase;
describe('Fetch Users', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new FetchUsersUseCase(inMemoryUsersRepository);
  });

  it('should be able to fetch users', async () => {
    await inMemoryUsersRepository.create(
      makeUser({ username: Username.create('joao') }),
    );
    await inMemoryUsersRepository.create(
      makeUser({ username: Username.create('pedro') }),
    );
    await inMemoryUsersRepository.create(
      makeUser({ username: Username.create('tigas') }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.users).toHaveLength(3);
  });

  it('should be able to fetch paginated users', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryUsersRepository.create(
        makeUser({
          email: `user${i}@gmail.com`,
          role: i / 2 == 0 ? UserRole.TEACHER : UserRole.SECRETARY,
        }),
      );
    }
    const result = await sut.execute({
      page: 3,
    });
    const result2 = await sut.execute({
      page: 1,
      content: 'user9',
      role: UserRole.SECRETARY,
    });

    expect(result.value?.users).toHaveLength(2);
    expect(result2.value?.users).toHaveLength(1);
  });
});
