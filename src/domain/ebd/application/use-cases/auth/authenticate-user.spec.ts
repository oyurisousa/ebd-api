import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakerHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateUserUseCase } from './authenticate-user';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakerHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakerHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });
  it('shoult be able to authenticate a user', async () => {
    const user = makeUser({
      username: Username.create('moises_01'),
      email: 'teste@gmail.com',
      passwordHash: await fakeHasher.hash('1234567'),
      role: UserRole.SHEPHERD,
    });

    await inMemoryUsersRepository.create(user);
    const result = await sut.execute({
      username: 'moises_01',
      password: '1234567',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
  it('shoult not be able to authenticate a user with bad credentials', async () => {
    const user = makeUser({
      username: Username.create('arao.002'),
      email: 'teste@gmail.com',
      passwordHash: await fakeHasher.hash('1234567'),
    });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      username: 'arao.002',
      password: '1234567asasas',
    });
    expect(result.isLeft()).toBeTruthy();
  });
});
