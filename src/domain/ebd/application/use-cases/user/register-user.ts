import { left, right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@/domain/ebd/enterprise/user';
import { UsersRepository } from '../../repositories/users-repository';
import { HashGenerator } from '../../cryptography/hash-generator';
import { UserWithSameEmailAlreadyExistsError } from './_errors/user-with-same-email-already-exists-error';
import { UserWithSameUsernameAlreadyExistsError } from './_errors/user-with-same-username-already-exists-error';
import { MembersRepository } from '../../repositories/members-repository';
import { MemberNotFoundError } from '../member/_errors/member-not-found-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface createUserUseCaseRequest {
  email: string;
  password: string;
  username: string;
  memberId?: string;
  role?: UserRole;
}

type createUserUseCaseResponse = Either<
  UserWithSameEmailAlreadyExistsError | UserWithSameUsernameAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private membersRepository: MembersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    username,
    email,
    password,
    role,
    memberId,
  }: createUserUseCaseRequest): Promise<createUserUseCaseResponse> {
    if (memberId) {
      const member = await this.membersRepository.findById(memberId);

      if (!member) {
        return left(new MemberNotFoundError(memberId));
      }
    }

    const userWithSameEmail = await this.userRepository.findByEmail(email);
    if (userWithSameEmail) {
      return left(new UserWithSameEmailAlreadyExistsError(email));
    }

    const userWithSameUsername =
      await this.userRepository.findByUsername(username);
    if (userWithSameUsername) {
      return left(new UserWithSameUsernameAlreadyExistsError(username));
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const user = User.create({
      username,
      email,
      passwordHash,
      role,
      memberId: memberId ? new UniqueEntityId(memberId) : null,
    });

    await this.userRepository.create(user);

    return right({
      user,
    });
  }
}
