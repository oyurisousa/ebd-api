import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { Member, type Sex } from '@/domain/ebd/enterprise/member';
import { MembersRepository } from '../../repositories/members-repository';

interface FetchMembersUseCaseRequest {
  page: number;
  name?: string;
  birthDate?: Date;
  sex?: Sex;
}

type FetchMembersUseCaseResponse = Either<
  null,
  {
    members: Member[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchMembersUseCase {
  constructor(private membersRepository: MembersRepository) {}

  async execute({
    page,
    name,
    sex,
    birthDate,
  }: FetchMembersUseCaseRequest): Promise<FetchMembersUseCaseResponse> {
    const { members, meta } = await this.membersRepository.findMany(
      { page },
      { name, sex, birthDate },
    );

    return right({
      members,
      meta,
    });
  }
}
