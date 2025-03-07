import { left, right, type Either } from '@/core/either';
import { UsersRepository } from '../../repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { UserNotFoundError } from './_errors/user-not-found-error';
import { User } from '@/domain/ebd/enterprise/user';

interface GetDetailsUserUseCaseRequest {
  userId: string;
}

type GetDetailsUserUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class GetUserDetailsUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetDetailsUserUseCaseRequest): Promise<GetDetailsUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return left(new UserNotFoundError(userId));
    }

    return right({
      user,
    });
  }
}
