import { left, right, type Either } from '@/core/either';

import { UsersRepository } from '../../repositories/users-repository';
import { HashComparer } from '../../cryptography/hash-compare';
import { Encrypter } from '../../cryptography/encrypter';
import { Injectable } from '@nestjs/common';
import { WrongCredentialsError } from './_errors/wrong-credentials-error';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypter({
      sub: user.id.toString(),
      role: user.role.toString(),
    });

    return right({
      accessToken,
    });
  }
}
