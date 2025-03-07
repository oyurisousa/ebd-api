import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { GetUserDetailsUseCase } from './get-user-details';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserDetailsUseCase;
describe('Get User Details', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new GetUserDetailsUseCase(inMemoryUsersRepository);
  });

  it('should be able to get user details', async () => {
    const user = makeUser({
      username: Username.create('john1000'),
    });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({ userId: user.id.toString() });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.user.id).toBe(user.id);
    }
  });
});
