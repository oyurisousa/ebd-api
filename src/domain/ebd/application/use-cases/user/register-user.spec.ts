import { RegisterUserUseCase } from './register-user';
import { FakerHasher } from 'test/cryptography/fake-hasher';
import { faker } from '@faker-js/faker';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { UserWithSameEmailAlreadyExistsError } from './_errors/user-with-same-email-already-exists-error';
import { UserWithSameUsernameAlreadyExistsError } from './_errors/user-with-same-username-already-exists-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakerHasher;
let sut: RegisterUserUseCase;

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakerHasher();
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher);
  });
  it('shoult be able to register a new User', async () => {
    const result = await sut.execute({
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.TEACHER,
      username: faker.person.firstName(),
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryUsersRepository.items).toHaveLength(1);
      expect(inMemoryUsersRepository.items[0].email).toEqual(
        result.value?.user.email,
      );
    }
  });

  it('shoult hash user password upon registration', async () => {
    const result = await sut.execute({
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: '123456',
      role: UserRole.TEACHER,
    });

    const hashedPassword = await fakeHasher.hash('123456');
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryUsersRepository.items[0].passwordHash).toBe(hashedPassword);
  });

  it('shoult not be able to register two users with same email', async () => {
    const result = await sut.execute({
      username: faker.person.firstName(),
      email: 'teste@gmail.com',
      password: faker.internet.password(),
      role: UserRole.SECRETARY,
    });

    const result2 = await sut.execute({
      username: faker.person.firstName(),
      email: 'teste@gmail.com',
      password: faker.internet.password(),
      role: UserRole.SUPERINTENDENT,
    });
    expect(result.isRight()).toBeTruthy();
    expect(result2.isLeft()).toBeTruthy();
    expect(result2.value).toBeInstanceOf(UserWithSameEmailAlreadyExistsError);
    if (result.isRight()) {
      expect(inMemoryUsersRepository.items).toHaveLength(1);
      expect(inMemoryUsersRepository.items[0].email).toBe(
        result.value?.user.email,
      );
    }
  });
  it('shoult not be able to register two users with same username', async () => {
    const result = await sut.execute({
      username: 'abraao01',
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.SECRETARY,
    });

    const result2 = await sut.execute({
      username: 'abraao01',
      email: faker.internet.email(),

      password: faker.internet.password(),
      role: UserRole.SUPERINTENDENT,
    });
    expect(result.isRight()).toBeTruthy();
    expect(result2.isLeft()).toBeTruthy();
    expect(result2.value).toBeInstanceOf(
      UserWithSameUsernameAlreadyExistsError,
    );
    if (result.isRight()) {
      expect(inMemoryUsersRepository.items).toHaveLength(1);
      expect(inMemoryUsersRepository.items[0].username).toBe(
        result.value?.user.username,
      );
    }
  });
});
