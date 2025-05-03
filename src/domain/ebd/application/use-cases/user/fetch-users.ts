import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { User, type UserRole } from '@/domain/ebd/enterprise/user';
import { UsersRepository } from '../../repositories/users-repository';

interface FetchUsersUseCaseRequest {
  page: number;
  perPage?: number;
  content?: string;
  role?: UserRole;
}

type FetchUsersUseCaseResponse = Either<
  null,
  {
    users: User[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    perPage,
    role,
    content,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const { users, meta } = await this.usersRepository.findMany(
      { page, perPage },
      { content, role },
    );

    return right({
      users,
      meta,
    });
  }
}
